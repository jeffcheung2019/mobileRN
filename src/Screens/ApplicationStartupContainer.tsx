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
// @ts-ignore
import { LineChart } from 'react-native-gifted-charts' // this lib's typescript is incorrect
import { SharedElement } from 'react-navigation-shared-element'
import { colors } from '@/Utils/constants'
import { times } from 'lodash'
import { useSelector } from 'react-redux'
import { RootState } from '@/Store'
import { MainStackNavigatorParamList } from '@/Navigators/MainStackNavigator'

const appLogoHeight = 150
let nodeJsTimeout: NodeJS.Timeout

const ApplicationStartupContainer: FC<StackScreenProps<AuthNavigatorParamList | MainStackNavigatorParamList>> = ({ navigation }) => {
  const { Layout, Gutters, Fonts } = useTheme()
  const windowHeight = Dimensions.get('window').height
  const windowWidth = Dimensions.get('window').width
  const { t } = useTranslation()
  const topAnimatedVal = new Animated.Value(200)
  const animation = useSharedValue({ top: windowHeight / 2 - appLogoHeight / 2 })

  let { isLoggedIn } = useSelector((state: RootState) => state.user)
  const animationStyle = useAnimatedStyle(() => {
    return {
      top: withTiming(animation.value.top, {
        duration: 1000,
      }),
    }
  })

  useEffect(() => {
    nodeJsTimeout = setTimeout(() => {
      navigation.navigate(isLoggedIn ? RouteStacks.mainTab : RouteStacks.welcome)
    }, 1000)

    return () => {
      clearTimeout(nodeJsTimeout)
    }
  }, [isLoggedIn])

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
      {/* <Animated.View style={[{ position: 'absolute' }, animationStyle]}> */}
      <SharedElement id='app.icon'>
        <AppLogo
          style={{
            height: appLogoHeight,
          }}
          type='color'
        />
      </SharedElement>
      {/* </Animated.View> */}

      <View style={{ position: 'absolute', bottom: 0, left: -40, height: 300, opacity: 0.4 }}>
        <LineChart
          areaChart
          isAnimated={true}
          animationDuration={1000}
          showXAxisIndices={false}
          showYAxisIndices={false}
          hideYAxisText={true}
          yAxisThickness={0}
          yAxisIndicesWidth={0}
          yAxisLabelWidth={0}
          yAxisOffset={0}
          disableScroll
          hideDataPoints
          hideOrigin
          initialSpacing={0}
          width={windowWidth + 60}
          height={300}
          yAxisTextNumberOfLines={0}
          thickness={0}
          adjustToWidth
          startFillColor={colors.electricGreen}
          endFillColor={colors.green}
          data={
            times(10, e => {
              return {
                value: Math.random() * 4 + e,
              }
            }) as any
          }
        />
      </View>
    </View>
  )
}

export default ApplicationStartupContainer
