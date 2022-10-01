import React, { FC, ReactChildren, useCallback, useEffect } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, ImageBackground, ImageSourcePropType, Dimensions } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
// @ts-ignore
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'

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

  useFocusEffect(
    useCallback(() => {
      if (showTabBarScreens.includes(screenName)) {
        dispatch(showTabBar(true))
      } else {
        dispatch(showTabBar(false))
      }
    }, [screenName]),
  )

  return (
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
