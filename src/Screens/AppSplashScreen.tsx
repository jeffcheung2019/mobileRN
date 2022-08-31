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
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
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
import RNBootSplash from 'react-native-bootsplash'
import { VictoryArea, VictoryChart, VictoryTheme } from 'victory-native'

let nodeJsTimeout: NodeJS.Timeout

const AppSplashScreen: FC<StackScreenProps<MainStackNavigatorParamList, RouteStacks.appSplashScreen>> = ({ navigation }) => {
  const { Layout, Gutters, Fonts } = useTheme()
  const windowHeight = Dimensions.get('window').height
  const windowWidth = Dimensions.get('window').width
  const { t } = useTranslation()
  const animatedVal = useSharedValue({
    opacity: 1,
    scale: 1,
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(animatedVal.value.opacity, {
        duration: 600,
      }),
      transform: [
        {
          scale: withTiming(animatedVal.value.scale, {
            duration: 600,
          }),
        },
      ],
    }
  }, [animatedVal])
  let { isLoggedIn } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    nodeJsTimeout = setTimeout(() => {
      animatedVal.value = {
        opacity: 0,
        scale: 1.4,
      }

      navigation.navigate(RouteStacks.mainTab, {
        screen: RouteTabs.home,
        params: {
          screen: RouteStacks.homeMain,
        },
      })
    }, 1000)

    return () => {
      clearTimeout(nodeJsTimeout)
    }
  }, [isLoggedIn])

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Animated.View style={[animatedStyle, {}]}>
        <AppLogo
          imageStyle={{
            height: 128,
            width: 128,
            transform: [{ translateY: -10 }],
          }}
          type='color'
        />
      </Animated.View>

      <View style={{ position: 'absolute', bottom: 0, left: -50, height: windowHeight / 2, opacity: 0.4 }}>
        {/* <LineChart
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
          hideRules={true}
          curved
          hideOrigin
          initialSpacing={0}
          width={windowWidth + 60}
          height={windowHeight / 2}
          yAxisTextNumberOfLines={0}
          thickness={0}
          adjustToWidth
          startFillColor={colors.darkBlueGray}
          endFillColor={colors.white}
          data={
            times(10, e => {
              return {
                value: Math.random() * 4 + e,
              }
            }) as any
          }
        /> */}
      </View>
    </View>
  )
}

export default AppSplashScreen
