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
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login, logout } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import { CompositeScreenProps } from '@react-navigation/native'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { HomeScreenNavigatorParamList, HomeScreenNavigationProps } from '@/Screens/App/HomeScreen'
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

type HomeNewsDetailScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<HomeScreenNavigatorParamList, RouteStacks.homeNewsDetail>,
  HomeScreenNavigationProps
>

export type NewsDetail = {
  id: string
  title: string
  content: string
  imgUrl: string
}

let nodeJsTimeout: NodeJS.Timeout

const NewsDetailScreen: FC<HomeNewsDetailScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const news: NewsDetail = route.params?.news ?? {
    id: '',
    title: '',
    content: '',
    imgUrl: '',
  }
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false)

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

  // useEffect(() => {
  //   if (!!news) {
  //     navigation.navigate(RouteStacks.homeMain)
  //   }
  // }, [news])

  return (
    <ScreenBackgrounds screenName={RouteStacks.homeMain}>
      <Header onLeftPress={() => navigation.goBack()} withProfile={false} />
      <KeyboardAwareScrollView
        contentContainerStyle={[
          Layout.fill,
          Layout.colCenter,
          Gutters.regularHPadding,
          {
            alignItems: 'flex-start',
          },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={50} tintColor={colors.eucalyptus} />
        }
      >
        <View
          style={[
            Layout.fullWidth,
            {
              alignItems: 'center',
              height: 200,
              justifyContent: 'center',
            },
          ]}
        >
          <SharedElement style={{ width: '100%', height: '100%' }} id={`news.${news?.id}.image`}>
            <Image
              source={{ uri: news?.imgUrl === '' ? config.defaultNewsImgUrl : news?.imgUrl }}
              style={{ resizeMode: 'contain', backgroundColor: colors.brightGray, width: '100%', height: '100%' }}
            />
          </SharedElement>
        </View>

        <View
          style={[
            Layout.fullWidth,
            {
              flex: 1,
            },
          ]}
        >
          <SharedElement id={`news.${news.id}.title`}>
            <Text style={[{ fontSize: 14, color: colors.darkBlueGray, fontWeight: 'bold' }]}>{news.title}</Text>
          </SharedElement>
        </View>

        <View
          style={[
            Layout.fullWidth,
            {
              flex: 5,
            },
          ]}
        >
          <Text style={[{ fontSize: 10, color: colors.darkBlueGray }]}>{news.content}</Text>
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default NewsDetailScreen
