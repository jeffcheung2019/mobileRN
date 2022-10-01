/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback, FC, useRef, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  TextStyle,
  Platform,
  Alert,
  ViewStyle,
  RefreshControl,
  Dimensions,
  Linking,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login, logout } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
// @ts-ignore
import AnimateNumber from 'react-native-animate-number'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { api, colors, config } from '@/Utils/constants'
import { HomeScreenNavigatorParamList, HomeScreenProps } from '@/Screens/App/HomeScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Share from 'react-native-share'
import share from '@/Utils/share'
import HeaderLayout from '@/Styles/HeaderLayout'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import ActionButton from '@/Components/Buttons/ActionButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import times from 'lodash/times'
// @ts-ignore
import { Auth } from 'aws-amplify'
import axios, { Canceler, CancelTokenSource } from 'axios'
import { RootState } from '@/Store'
import CircularProgress from 'react-native-circular-progress-indicator'
import Svg, { G, Circle } from 'react-native-svg'
import { startLoading } from '@/Store/UI/actions'
import { forEach, map } from 'lodash'
import Animated, {
  FadeInDown,
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { Header } from '@/Components'
import { Avatar, Button, ListItem } from '@rneui/themed'
import InfoCard from '@/Components/InfoCard'
import { headerHeight } from '@/Components/Header'
import { SharedElement } from 'react-navigation-shared-element'
import NewsCard from '@/Components/Cards/NewsCard'
import { getLiveFeed, LiveFeedProp } from '@/Queries/HomeTab'
import { queryConstants } from '@/Queries/Constants'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { TickerCompanyDetail, GraphPoint } from '@/Types/Graph'
import join from 'lodash/join'
import { Skeleton } from '@rneui/themed'
import useSWR from 'swr'
import Parser from 'rss-parser'
import moment from 'moment'
import HomeTopNewsPlaceholder from './Components/HomeTopNewsPlaceholder'
import HomeNewsPlaceholder from './Components/HomeNewsPlaceholder'
import FastImage from 'react-native-fast-image'

const PURPLE_COLOR = {
  color: colors.magicPotion,
}

type HomeMainScreenProps = CompositeScreenProps<StackScreenProps<HomeScreenNavigatorParamList, RouteStacks.homeMain>, HomeScreenProps>

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const tickerNames = ['S&P 500', 'Dow 30', 'Nasdaq', 'Russell 2000']

const parser: Parser<any, any> = new Parser({
  customFields: {
    // feed: ['foo', 'baz'],
    // //            ^ will error because `baz` is not a key of CustomFeed
    // item: ['bar']
    item: ['title', 'link', 'guid', ''],
  },
})

const HomeMainScreen: FC<HomeMainScreenProps> = ({ navigation, route }) => {
  const keyboardAwareScrollViewRef = useRef<Animated.ScrollView>(null)
  // const cardsContainerARef: React.LegacyRef<Animated.ScrollView> = useAnimatedRef()
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [needFetchDtl, setNeedFetchDtl] = useState(true)
  const scaleY = useSharedValue(0)

  const [newsFeed, setNewsFeed] = useState([])

  useEffect(() => {
    const run = async () => {
      try {
        let feed = await parser.parseURL(
          api.rssFeedGoogleNews({
            q: 'stock news',
            after: moment().subtract(1, 'd').format('YYYY-MM-DD'),
            before: moment().add(1, 'd').format('YYYY-MM-DD'),
          }),
        )

        // console.log('feed', JSON.stringify(feed, null, 2))
        // console.log('feed', JSON.stringify(feed.options.customFields.items, null, 2))
        setNewsFeed(feed)
      } catch (err) {
        console.log('err ', err)
      }
    }

    run()
  }, [])

  const [homeGraphData, setHomeGraphData] = useState<any>(null)

  useEffect(() => {
    const run = async () => {
      try {
        let graphData: any = await Promise.all([
          axios.get(api.tickerUri('^GSPC')),
          axios.get(api.tickerUri('%5EDJI')),
          axios.get(api.tickerUri('^IXIC')),
          axios.get(api.tickerUri('^RUT')),
        ])

        let newHomeGraphData = []
        for (let j = 0; j < graphData.length; j++) {
          let res: any = graphData[j].data.spark.result[0]
          let timestamp = res.response[0].timestamp
          let close = res.response[0].indicators.quote[0].close
          let points: GraphPoint[] = []

          for (let i = 0; i < timestamp.length; i++) {
            points.push({
              date: new Date(Number(`${timestamp[i]}000`)),
              value: close[i],
            })
          }
          newHomeGraphData.push({
            tickerName: tickerNames[j],
            symbol: res.symbol,
            points,
            close: res.response[0].meta.regularMarketPrice,
            prevClose: res.response[0].meta.chartPreviousClose,
          })
        }
        setHomeGraphData(newHomeGraphData)
      } catch (err) {
        console.log('err', err)
      }
    }

    run()
  }, [])

  const liveFeedResult = getLiveFeed({
    limit: 20,
    companyIds: [],
    categoryIds: queryConstants.getLiveFeed.homeNews.categoryIds,
    sourceIds: queryConstants.getLiveFeed.homeNews.sourceIds,
  })

  const onRefresh = () => {
    setNeedFetchDtl(true)
  }

  const scrollPosition = useSharedValue<number>(0)
  const cardsContainerScrollPosition = useSharedValue<number>(0)

  const onCardsContainerScroll = useAnimatedScrollHandler({
    onScroll: event => {
      cardsContainerScrollPosition.value = event.contentOffset.x
    },
  })

  const onContainerScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollPosition.value = event.contentOffset.y
    },
  })

  // const cardsContainerAnimatedStyle = useAnimatedStyle(() => {
  //   scrollPosition
  //   let cardsContainerMeasuredVal = measure(cardsContainerARef)
  //   let cardsContainerHeight = cardsContainerMeasuredVal.height
  //   let cardsContainerOffsetY = cardsContainerMeasuredVal.pageY - headerHeight
  //   return {
  //     opacity: cardsContainerOffsetY < 0 ? ((cardsContainerOffsetY + cardsContainerHeight) * 0.5) / cardsContainerHeight : 1,
  //   }
  // }, [scrollPosition, cardsContainerARef])

  // console.log('liveFeedResult ', JSON.stringify(liveFeedResult[0], null, 2))

  useEffect(() => {
    dispatch(startLoading(false))
    setTimeout(() => {
      setNeedFetchDtl(false)
    }, 600)
  }, [needFetchDtl])

  return (
    <ScreenBackgrounds screenName={RouteStacks.homeMain}>
      <Header
        withProfile={true}
        onProfilePress={() => {
          navigation.navigate(RouteStacks.setting, {
            screen: RouteStacks.settingMain,
          })
        }}
        rightIcon={() => {
          return (
            <Pressable
              onPress={() =>
                navigation.navigate(RouteStacks.notification, {
                  screen: RouteStacks.notificationMain,
                })
              }
            >
              <MaterialIcons name='notifications' size={config.iconSize} color={colors.darkBlueGray} />
            </Pressable>
          )
        }}
      />

      <Animated.ScrollView
        ref={keyboardAwareScrollViewRef}
        scrollEventThrottle={16}
        onScroll={onContainerScroll}
        contentContainerStyle={[
          {
            alignItems: 'center',
            width: '100%',
            paddingTop: 10,
            paddingBottom: 40,
          },
        ]}
        horizontal={false}
        style={{
          width: '100%',
        }}
        refreshControl={
          <RefreshControl refreshing={needFetchDtl} onRefresh={onRefresh} progressViewOffset={10} tintColor={colors.homeTheme} />
        }
      >
        {
          // <Animated.ScrollView
          //   ref={cardsContainerARef}
          //   horizontal={true}
          //   scrollEventThrottle={16}
          //   onScroll={onCardsContainerScroll}
          //   showsHorizontalScrollIndicator={false}
          //   style={[{}, cardsContainerAnimatedStyle]}
          // >
          //   {map(homeGraphData, (elem, idx: number) => {
          //     return (
          //       <View
          //         key={`InfoCard-${idx}`}
          //         style={[
          //           {
          //             margin: 8,
          //           },
          //         ]}
          //       >
          //         <InfoCard
          //           points={elem.points}
          //           cardIdx={idx}
          //           ticker={elem.ticker}
          //           tickerName={elem.tickerName}
          //           close={elem.close}
          //           prevClose={elem.prevClose}
          //           scrollPosition={cardsContainerScrollPosition}
          //         />
          //       </View>
          //     )
          //   })}
          // </Animated.ScrollView>
        }

        <ScrollView style={[{ width: '100%' }]} contentContainerStyle={{ flex: 1, width: '100%' }} showsVerticalScrollIndicator={false}>
          {liveFeedResult && liveFeedResult[0] ? (
            <Pressable
              onPress={() =>
                navigation.navigate(RouteStacks.homeNewsDetail, {
                  news: {
                    id: liveFeedResult[0]?.newsItem?.link,
                    newsItemId: liveFeedResult[0]?.newsItem?.id,
                    title: liveFeedResult[0]?.newsItem?.title,
                    content: liveFeedResult[0]?.newsItem?.summary,
                    imgUrl: liveFeedResult[0]?.newsItem?.imgUrl,
                    tickers: liveFeedResult[0]?.companies.map((company: TickerCompanyDetail) => {
                      return company.ticker
                    }),
                  },
                })
              }
              style={{
                maxHeight: 280,
                width: '100%',
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  height: 170,
                  width: '100%',
                  justifyContent: 'flex-start',
                }}
              >
                <SharedElement id={`news.${liveFeedResult[0]?.newsItem?.link}.image`}>
                  <FastImage
                    source={{
                      uri: liveFeedResult[0]?.newsItem?.imgUrl === '' ? config.defaultNewsImgUrl : liveFeedResult[0]?.newsItem?.imgUrl,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode={'cover'}
                  />
                </SharedElement>
              </View>

              <View
                style={{
                  height: 50,
                }}
              >
                <ScrollView
                  horizontal
                  style={{
                    width: '100%',
                  }}
                  contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SharedElement
                    id={`news.${liveFeedResult[0]?.newsItem?.link}.tickers.${join(
                      liveFeedResult[0]?.companies.map((company: TickerCompanyDetail) => {
                        return company.ticker
                      }),
                      '-',
                    )}`}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                      }}
                    >
                      {map(liveFeedResult[0]?.companies, (company, idx) => {
                        return (
                          <View
                            key={`ticker-${idx}`}
                            style={{
                              backgroundColor: colors.darkBlueGray,
                              marginRight: 4,
                              height: 30,
                              justifyContent: 'center',
                              paddingHorizontal: 8,
                              borderRadius: 4,
                            }}
                          >
                            <Text style={{ fontWeight: 'bold', fontSize: 14, color: colors.white }}>${company?.ticker}</Text>
                          </View>
                        )
                      })}
                    </View>
                  </SharedElement>
                </ScrollView>
              </View>

              <View style={{ maxHeight: 60, justifyContent: 'center' }}>
                <SharedElement id={`news.${liveFeedResult[0]?.newsItem?.link}.title`}>
                  <Text style={{ color: colors.darkBlueGray, fontSize: 14, fontWeight: 'bold' }} numberOfLines={3}>
                    {liveFeedResult[0]?.newsItem.title}
                  </Text>
                </SharedElement>
              </View>
            </Pressable>
          ) : (
            <HomeTopNewsPlaceholder />
          )}

          {liveFeedResult === undefined || liveFeedResult.length === 0 ? (
            <View>
              <HomeNewsPlaceholder />
              <HomeNewsPlaceholder />
              <HomeNewsPlaceholder />
              <HomeNewsPlaceholder />
            </View>
          ) : (
            map(liveFeedResult, (elem: any, idx: number) => {
              if (idx === 0) return null
              let newsDtl = {
                id: elem?.newsItem?.link,
                title: elem?.newsItem?.title,
                content: elem?.newsItem?.summary,
                imgUrl: elem?.newsItem?.imgUrl,
                newsItemId: elem?.newsItem?.id,
                tickers: elem?.companies.map((company: TickerCompanyDetail) => company.ticker),
              }
              return (
                <View style={{ width: '100%', height: 90 }} key={`NewsCard-${idx}`}>
                  <NewsCard
                    news={newsDtl}
                    onPress={() => {
                      navigation.navigate(RouteStacks.homeNewsDetail, {
                        news: newsDtl,
                      })
                    }}
                  />
                </View>
              )
            })
          )}
        </ScrollView>
      </Animated.ScrollView>
    </ScreenBackgrounds>
  )
}

export default HomeMainScreen
