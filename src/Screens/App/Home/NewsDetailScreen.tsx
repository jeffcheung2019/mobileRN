import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  TextStyle,
  Alert,
  ViewStyle,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login, logout } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import { CompositeScreenProps } from '@react-navigation/native'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { HomeScreenNavigatorParamList, HomeScreenProps } from '@/Screens/App/HomeScreen'
import EncryptedStorage from 'react-native-encrypted-storage'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
// @ts-ignore
import { Auth } from 'aws-amplify'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import Header from '@/Components/Header'
import { SharedElement } from 'react-navigation-shared-element'
import join from 'lodash/join'
import map from 'lodash/map'
import RenderHtml from 'react-native-render-html'
import { getNewsItemData } from '@/Queries/HomeTab'
import { Skeleton } from '@rneui/base'
import FastImage from 'react-native-fast-image'

const SKELETON_NEWS_CONTENT: ViewStyle = {
  marginVertical: 4,
}

type HomeNewsDetailScreenProps = CompositeScreenProps<
  StackScreenProps<HomeScreenNavigatorParamList, RouteStacks.homeNewsDetail>,
  HomeScreenProps
>

export type NewsDetail = {
  id: string
  newsItemId: number
  title: string
  content: string
  imgUrl: string
  tickers: string[]
}

let nodeJsTimeout: NodeJS.Timeout

const windowWidth = Dimensions.get('window').width

const NewsDetailScreen: FC<HomeNewsDetailScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const news: NewsDetail = route.params?.news ?? {
    id: '',
    title: '',
    content: '',
    imgUrl: '',
    tickers: [],
    newsItemId: -1,
  }
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false)

  const newsItemDataResult = getNewsItemData(news?.newsItemId)

  const onRefresh = async () => {
    setRefreshing(true)

    nodeJsTimeout = setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  useEffect(() => {
    return () => {
      clearTimeout(nodeJsTimeout)
    }
  }, [])

  let hasImage = news?.imgUrl !== ''

  return (
    <ScreenBackgrounds screenName={RouteStacks.homeNewsDetail}>
      <Header onLeftPress={() => navigation.goBack()} withProfile={false} />
      <KeyboardAwareScrollView
        contentContainerStyle={[
          Layout.fill,
          Layout.colCenter,
          Gutters.regularHPadding,
          {
            alignItems: 'flex-start',
            paddingTop: 8,
          },
        ]}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={50} tintColor={colors.eucalyptus} />
        }
      >
        {
          <View
            style={[
              Layout.fullWidth,
              {
                alignItems: 'center',
                height: 100,
                justifyContent: 'center',
              },
            ]}
          >
            <SharedElement style={{ width: '100%', height: '100%' }} id={`news.${news?.id}.image`}>
              <FastImage
                source={{ uri: hasImage ? news?.imgUrl : config.defaultNewsImgUrl, priority: FastImage.priority.high }}
                resizeMode={hasImage ? 'contain' : 'cover'}
                style={{ backgroundColor: colors.white, width: '100%', height: '100%' }}
              />
            </SharedElement>
          </View>
        }

        <View style={{ flexBasis: 40, width: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
          <SharedElement id={`news.${news?.id}.tickers.${join(news?.tickers, '-')}`} style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              {map(news?.tickers, (ticker: string, idx: number) => {
                return (
                  <View
                    key={`ticker-${idx}`}
                    style={{
                      backgroundColor: colors.darkBlueGray,
                      marginHorizontal: 4,
                      height: 30,
                      justifyContent: 'center',
                      paddingHorizontal: 8,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: colors.white }}>${ticker}</Text>
                  </View>
                )
              })}
            </View>
          </SharedElement>
        </View>

        <View
          style={[
            Layout.fullWidth,
            {
              paddingHorizontal: 4,
            },
          ]}
        >
          <SharedElement id={`news.${news.id}.title`}>
            <Text style={[{ fontSize: 18, color: colors.darkBlueGray, fontWeight: 'bold' }]}>{news.title}</Text>
          </SharedElement>
        </View>

        <ScrollView
          style={[
            Layout.fullWidth,
            {
              flex: 5,
              paddingTop: 10,
              paddingRight: 10,
              paddingLeft: 4,
            },
          ]}
        >
          {newsItemDataResult?.html ? (
            <RenderHtml
              contentWidth={windowWidth}
              source={{ html: newsItemDataResult?.html }}
              tagsStyles={{
                p: {
                  fontSize: 12,
                  color: colors.darkBlueGray,
                },
              }}
            />
          ) : (
            <>
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' width={(windowWidth * 2) / 3} height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' width={(windowWidth * 2) / 3} height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' width={windowWidth / 2} height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
              <Skeleton style={[SKELETON_NEWS_CONTENT]} animation='pulse' height={6} />
            </>
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default NewsDetailScreen
