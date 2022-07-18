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
import Animated, { EasingNode, timing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { AuthNavigatorParamList } from '@/Navigators/AuthNavigator'

const appLogoHeight = 150
let nodeJsTimeout: NodeJS.Timeout

const ApplicationStartupContainer: FC<StackScreenProps<ApplicationNavigatorParamList, RouteStacks.application>> = ({ navigation }) => {
  const { Layout, Gutters, Fonts } = useTheme()
  const windowHeight = Dimensions.get('window').height
  const { t } = useTranslation()
  const topAnimatedVal = new Animated.Value(200)
  const animation = useSharedValue({ top: windowHeight / 2 - appLogoHeight / 2 })
  const animationStyle = useAnimatedStyle(() => {
    return {
      top: withTiming(animation.value.top, {
        duration: 500,
      }),
    }
  })

  useEffect(() => {
    animation.value = { top: 80 }
    nodeJsTimeout = setTimeout(() => {
      navigation.replace(RouteStacks.mainStack)
    }, 500)

    return () => {
      clearTimeout(nodeJsTimeout)
    }
  }, [])

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      {/* <Video
        style={{
          height: Dimensions.get('window').height,
          position: 'absolute',
          top: -10,
          left: 0,
          alignItems: 'stretch',
          bottom: 0,
          right: 0,
        }}
        source={require('../Assets/Videos/b.mp4')}
        resizeMode='cover'
        rate={1.0}
        muted={true}
        repeat={true}
        ignoreSilentSwitch='obey'
      /> */}
      <Animated.View style={[{ position: 'absolute' }, animationStyle]}>
        <AppLogo
          style={{
            height: appLogoHeight,
          }}
          type='color'
        />
      </Animated.View>
    </View>
  )
}

export default ApplicationStartupContainer
