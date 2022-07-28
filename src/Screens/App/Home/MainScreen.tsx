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
  Image,
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
import { HomeScreenNavigatorParamList, HomeScreenNavigationProps } from '@/Screens/App/HomeScreen'
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
import CircleButton from '@/Components/Buttons/CircleButton'
import Clipboard from '@react-native-clipboard/clipboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import times from 'lodash/times'
// @ts-ignore
import { Auth } from 'aws-amplify'
import axios, { Canceler, CancelTokenSource } from 'axios'
import { RootState } from '@/Store'
import world from '@/Assets/Images/Home/world.png'
import CircularProgress from 'react-native-circular-progress-indicator'
import Svg, { G, Circle } from 'react-native-svg'
import { startLoading } from '@/Store/UI/actions'
import { forEach, map } from 'lodash'
import Animated, {
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

const PURPLE_COLOR = {
  color: colors.magicPotion,
}

type HomeMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<HomeScreenNavigatorParamList, RouteStacks.homeMain>,
  HomeScreenNavigationProps
>

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const tickerNames = ['S&P 500', 'Dow 30', 'Nasdaq', 'Russell 2000', 'Crude Oil', '10-Yr Bond']

const HomeMainScreen: FC<HomeMainScreenNavigationProps> = ({ navigation, route }) => {
  const keyboardAwareScrollViewRef = useRef<Animated.ScrollView>(null)
  const cardsContainerARef: React.LegacyRef<Animated.ScrollView> = useAnimatedRef()
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [needFetchDtl, setNeedFetchDtl] = useState(true)
  const scaleY = useSharedValue(0)

  const [homeGraphData, setHomeGraphData] = useState<any>(null)

  useEffect(() => {
    const run = async () => {
      try {
        let graphData: any = await Promise.all([
          axios.get(api.djiUri),
          axios.get(api.sandpUri),
          axios.get(api.nasdaqUri),
          axios.get(api.russellUri),
        ])

        let newHomeGraphData = []
        for (let j = 0; j < graphData.length; j++) {
          let res: any = graphData[j].data.spark.result[0]
          let timestamp = res.response[0].timestamp
          let close = res.response[0].indicators.quote[0].close
          let points = []

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
    limit: 5,
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

  const cardsContainerAnimatedStyle = useAnimatedStyle(() => {
    scrollPosition
    let cardsContainerMeasuredVal = measure(cardsContainerARef)
    let cardsContainerHeight = cardsContainerMeasuredVal.height
    let cardsContainerOffsetY = cardsContainerMeasuredVal.pageY - headerHeight
    return {
      opacity: cardsContainerOffsetY < 0 ? ((cardsContainerOffsetY + cardsContainerHeight) * 0.5) / cardsContainerHeight : 1,
    }
  }, [scrollPosition, cardsContainerARef])

  useEffect(() => {
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
        scrollEventThrottle={1000 / 60}
        onScroll={onContainerScroll}
        contentContainerStyle={[Layout.colCenter]}
        refreshControl={
          <RefreshControl refreshing={needFetchDtl} onRefresh={onRefresh} progressViewOffset={10} tintColor={colors.homeTheme} />
        }
      >
        {
          <Animated.ScrollView
            ref={cardsContainerARef}
            horizontal={true}
            scrollEventThrottle={1000 / 60}
            onScroll={onCardsContainerScroll}
            showsHorizontalScrollIndicator={false}
            style={[{}, cardsContainerAnimatedStyle]}
          >
            {map(homeGraphData, (elem, idx: number) => {
              return (
                <View
                  key={`InfoCard-${idx}`}
                  style={[
                    {
                      margin: 8,
                    },
                  ]}
                >
                  <InfoCard
                    points={elem.points}
                    cardIdx={idx}
                    ticker={elem.ticker}
                    tickerName={elem.tickerName}
                    close={elem.close}
                    prevClose={elem.prevClose}
                    scrollPosition={cardsContainerScrollPosition}
                  />
                </View>
              )
            })}
          </Animated.ScrollView>
        }

        <Animated.ScrollView style={{ width: '100%' }} horizontal={false} showsVerticalScrollIndicator={false}>
          {liveFeedResult && liveFeedResult[0] && (
            <Pressable
              onPress={() =>
                navigation.navigate(RouteStacks.homeNewsDetail, {
                  news: {
                    id: liveFeedResult[0]?.newsItem?.link,
                    title: liveFeedResult[0]?.newsItem?.title,
                    content: liveFeedResult[0]?.newsItem?.summary,
                    imgUrl: liveFeedResult[0]?.newsItem?.imgUrl,
                  },
                })
              }
              style={{
                height: 300,
                width: '100%',
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  height: 200,
                  width: '100%',
                }}
              >
                <SharedElement id={`news.${liveFeedResult[0]?.newsItem?.link}.image`}>
                  <Image
                    source={{
                      uri: liveFeedResult[0]?.newsItem?.imgUrl === '' ? config.defaultNewsImgUrl : liveFeedResult[0]?.newsItem?.imgUrl,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                </SharedElement>
              </View>
              <ScrollView
                horizontal
                style={{
                  width: '100%',
                  height: 40,
                }}
                contentContainerStyle={{
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {map(liveFeedResult[0]?.companies, (company, idx) => {
                  return (
                    <View
                      key={`liveFeedCompanies-${idx}`}
                      style={{
                        backgroundColor: colors.darkBlueGray,
                        marginHorizontal: 4,
                        height: 30,
                        justifyContent: 'center',
                        paddingHorizontal: 8,
                      }}
                    >
                      <SharedElement id={`news.${liveFeedResult[0]?.newsItem?.link}.title`}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, color: colors.white }}>${company?.ticker}</Text>
                      </SharedElement>
                    </View>
                  )
                })}
              </ScrollView>
              <View
                style={{
                  height: 20,
                }}
              >
                <SharedElement id={`news.${liveFeedResult[0]?.newsItem?.link}.content`}>
                  <Text style={{ color: colors.darkBlueGray, fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>
                    {liveFeedResult[0]?.newsItem.title}
                  </Text>
                </SharedElement>
              </View>
              <View
                style={{
                  height: 40,
                }}
              >
                <Text style={{ color: colors.darkBlueGray, fontSize: 12 }} numberOfLines={2}>
                  {liveFeedResult[0]?.newsItem.summary}
                </Text>
              </View>
            </Pressable>
          )}

          {map(liveFeedResult, (elem: any, idx: number) => {
            if (idx === 0) return null
            let newsDtl = {
              id: elem.newsItem.link,
              title: elem.newsItem.title,
              content: elem.newsItem.summary,
              imgUrl: elem.newsItem.imgUrl,
            }
            return (
              <View style={{ width: '100%', height: 100 }} key={`NewsCard-${idx}`}>
                <NewsCard
                  news={newsDtl}
                  onPress={() =>
                    navigation.navigate(RouteStacks.homeNewsDetail, {
                      news: newsDtl,
                    })
                  }
                />
              </View>
            )
          })}
        </Animated.ScrollView>
      </Animated.ScrollView>
    </ScreenBackgrounds>
  )
}

export default HomeMainScreen
