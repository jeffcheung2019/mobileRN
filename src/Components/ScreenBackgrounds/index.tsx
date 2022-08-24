import React, { FC, ReactChildren, useCallback, useEffect } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, ImageBackground, ImageSourcePropType, Dimensions } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import { RouteStacks, RouteTabs, RouteTopTabs } from '@/Navigators/routes'
// @ts-ignore
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'

import bg1 from '@/Assets/Images/backgrounds/bg_01.png'
import bg2 from '@/Assets/Images/backgrounds/bg_02.png'
import bg3 from '@/Assets/Images/backgrounds/bg_03.png'
import Animated, { interpolate, interpolateSharableColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useRoute, useNavigationState, useFocusEffect } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { showTabBar } from '@/Store/Slices/ui'

type ScreenBackgroundsProps = {
  // source: ImageSourcePropType
  children: React.ReactNode
  uri?: string
  screenName: RouteStacks | RouteTabs
}

// Refers to RouteStacks
const ScreenImageMap: any = {
  [RouteStacks.welcome]: 'video',
  [RouteStacks.logIn]: 'video',
  [RouteStacks.signUp]: 'video',
  [RouteStacks.enterInvitationCode]: 'video',

  [RouteStacks.validationCode]: bg2,
  [RouteStacks.forgotPassword]: bg2,
  [RouteStacks.signUpWithCode]: bg2,
  [RouteStacks.createNewPassword]: bg2,

  [RouteStacks.homeMain]: bg2,
  [RouteStacks.homeNewsDetail]: bg2,

  [RouteStacks.earningMain]: bg2,
  [RouteStacks.stockQuoteMain]: bg2,
  [RouteStacks.stockInfoMain]: bg2,

  [RouteStacks.setting]: bg2,
  [RouteStacks.provideEmail]: bg2,
  [RouteStacks.registrationCompleted]: bg2,
}

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const nameColorMap: {
  [K in RouteStacks as string]?: string
} = {
  [RouteStacks.homeMain]: colors.homeTheme,
  [RouteStacks.earningMain]: colors.earningTheme,
  [RouteStacks.searchMain]: colors.searchTheme,
  [RouteStacks.stockInfoMain]: colors.stockInfoTheme,
  [RouteStacks.stockQuoteMain]: colors.chartTheme,
}

const showTabBarScreens: (RouteStacks | RouteTabs)[] = [
  RouteStacks.homeMain,
  RouteStacks.earningMain,
  RouteStacks.searchMain,
  RouteStacks.stockInfoMain,
  RouteStacks.stockQuoteMain,
]

const ScreenBackgrounds = ({ uri, screenName, children }: ScreenBackgroundsProps) => {
  const route = useRoute()
  const dispatch = useDispatch()

  // if uri exists, then use uri
  let source: ImageSourcePropType = uri
    ? {
        uri,
      }
    : screenName
    ? ScreenImageMap[screenName]
    : {}

  useFocusEffect(
    useCallback(() => {
      if (showTabBarScreens.includes(screenName)) {
        dispatch(showTabBar(true))
      } else {
        dispatch(showTabBar(false))
      }
    }, [screenName]),
  )

  return ScreenImageMap[screenName] === 'video' ? (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      {children}
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      {children}
    </View>
  )
}

ScreenBackgrounds.defaultProps = {}

export default ScreenBackgrounds
