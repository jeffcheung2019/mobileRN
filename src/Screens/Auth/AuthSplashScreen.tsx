import React, { FC, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, View, Text, Dimensions, Easing, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
// @ts-ignore
import Video from 'react-native-video'
import { useTheme } from '@/Hooks'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { useNavigation } from '@react-navigation/native'
import AppLogo from '@/Components/Icons/AppLogo'
import { RouteStacks } from '@/Navigators/routes'
import { StackScreenProps } from '@react-navigation/stack'
import { ApplicationNavigatorParamList } from '@/Navigators/Application'
// @ts-nocheck
import Animated, {
  EasingNode,
  measure,
  timing,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { AuthNavigatorParamList } from '@/Navigators/AuthNavigator'
// @ts-ignore
import { LineChart } from 'react-native-gifted-charts' // this lib's typescript is incorrect
import { SharedElement } from 'react-navigation-shared-element'
import { colors } from '@/Utils/constants'
import { times } from 'lodash'
import { useSelector } from 'react-redux'
import { RootState } from '@/Store'
import { MainStackNavigatorParamList } from '@/Navigators/MainStackNavigator'
import RNBootSplash from 'react-native-bootsplash'
import { headerHeight } from '@/Components/Header'

let nodeJsTimeout: NodeJS.Timeout

const AuthSplashScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.authSplashScreen>> = ({ navigation }) => {
  const { Layout, Gutters, Fonts } = useTheme()
  const windowHeight = Dimensions.get('window').height
  const windowWidth = Dimensions.get('window').width
  const animatedVal = useSharedValue(windowHeight / 2 - 64)
  const { t } = useTranslation()
  const animatedViewRef: React.LegacyRef<Animated.View> = useAnimatedRef()

  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      top: withTiming(animatedVal.value, {
        duration: 1000,
      }),
    }
  }, [animatedViewRef])

  let { isLoggedIn } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    animatedVal.value = headerHeight
    nodeJsTimeout = setTimeout(() => {
      navigation.replace(RouteStacks.welcomeBack)
    }, 1000)

    return () => {
      clearTimeout(nodeJsTimeout)
    }
  }, [navigation])

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Animated.View style={[{ position: 'absolute' }, animatedViewStyle]}>
        <AppLogo
          imageStyle={{
            height: 128,
            width: 128,
          }}
          type='color'
        />
      </Animated.View>
    </View>
  )
}

export default AuthSplashScreen
