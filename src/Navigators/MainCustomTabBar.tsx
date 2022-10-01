import { colors } from '@/Utils/constants'
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps, NavigationHelpers, NavigatorScreenParams, TabNavigationState } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import React, { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Easing, Image, Pressable, Text, View, Animated } from 'react-native'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import cup from '@/Assets/Icons/tabs/cup.png'
import flag from '@/Assets/Icons/tabs/flag.png'
import home from '@/Assets/Icons/tabs/home.png'
import search from '@/Assets/Icons/tabs/search.png'
import time from '@/Assets/Icons/tabs/time.png'
import LinearGradient from 'react-native-linear-gradient'
import map from 'lodash/map'
import {
  BottomTabDescriptorMap,
  BottomTabNavigationEventMap,
  BottomTabNavigationHelpers,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { ApplicationNavigatorParamList } from './Application'
import { ImageSourcePropType } from 'react-native'
import { MainTabNavigatorParamList } from './MainStackNavigator'
import ReactNativeAnimated, {
  FadeInDown,
  FadeOutDown,
  interpolate,
  interpolateColor,
  measure,
  runOnUI,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { times } from 'lodash'
import { useSelector } from 'react-redux'
import { RootState } from '@/Store'
import Lottie from 'lottie-react-native'
import homeJson from 'Assets/Images/Gif/home.json'
import calendarJson from 'Assets/Images/Gif/calendar.json'
import searchJson from 'Assets/Images/Gif/search.json'
import search1Json from 'Assets/Images/Gif/search1.json'
import gridViewJson from 'Assets/Images/Gif/gridView.json'
import stockQuoteJson from 'Assets/Images/Gif/stockQuote.json'

const AnimatedLottie = ReactNativeAnimated.createAnimatedComponent(Lottie)
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

type TabWrapperViewProps = { focused: boolean; children: React.ReactNode; onLongPress: () => void; onPress: () => void }

const TabWrapperView: FC<TabWrapperViewProps> = ({ focused, children, onPress, onLongPress }) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        justifyContent: 'center',
        margin: 'auto',
        flex: 1,
        alignItems: 'center',
      }}
    >
      {children}
    </Pressable>
  )
}

type MainCustomTabBarProps = BottomTabBarProps & {
  tabBarIconsMap: {
    [Key in RouteStacks as string]?: () => React.ReactNode
  }
}

let dimensionRatioTimeout: NodeJS.Timeout

const nameColorMap = [colors.homeTheme, colors.earningTheme, colors.searchTheme, colors.stockInfoTheme, colors.chartTheme]

const animatedIconJson = [homeJson, calendarJson, search1Json, gridViewJson, stockQuoteJson]

const AnimatedTabBarIcon: FC<any> = ({ idx, focused }) => {
  const iconProgress = useSharedValue(0)
  const animatedProps = useAnimatedProps(() => {
    return {
      progress: withTiming(iconProgress.value, {
        duration: 1000,
      }),
    }
  })

  if (focused) {
    iconProgress.value = 1
  } else {
    iconProgress.value = 0
  }

  return (
    <AnimatedLottie
      animatedProps={animatedProps}
      autoSize
      source={animatedIconJson[idx]}
      resizeMode='contain'
      style={{ width: 30, height: 30 }}
    />
  )
}

const MainCustomTabBar: FC<MainCustomTabBarProps> = ({ state, descriptors, navigation: bottomTabNavigation, tabBarIconsMap }) => {
  const animationProgress = useRef(new Animated.Value(0.1))
  const routeIdxSharedValue = useSharedValue<number>(0)
  const highlightDimensionScale = useSharedValue<number>(1)
  const iconScales = useSharedValue<number[]>([1, 1, 1, 1, 1])

  const highlightRef = useRef(null)

  let routeNames: string[] = state.routeNames
  const containerAnimationStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(windowWidth * (routeIdxSharedValue.value * 0.2) + windowWidth / 10, {
        duration: 500,
      }),
    }
  })

  const highlightAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(highlightDimensionScale.value, {
            duration: highlightDimensionScale.value === 0.8 ? 0 : 500,
          }),
        },
      ],
    }
  }, [highlightDimensionScale, state.index])

  const iconAnimationStyle = (idx: number) => {
    return useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: state.index === idx ? iconScales.value[idx] : 1,
          },
        ],
      }
    }, [iconScales, state.index])
  }

  useEffect(() => {
    routeIdxSharedValue.value = state.index
    highlightDimensionScale.value = 1.2
    dimensionRatioTimeout = setTimeout(() => {
      highlightDimensionScale.value = 1.6
    }, 500)

    return () => {
      clearTimeout(dimensionRatioTimeout)
    }
  }, [routeIdxSharedValue, state.index])

  return (
    <View
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 80,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 2,
        }}
      >
        {map(state.routes, (route: TabNavigationState<MainTabNavigatorParamList>, idx: number) => {
          let focused = idx === state.index

          const onTabPress = () => {
            const event = bottomTabNavigation.emit({
              type: 'tabPress',
              target: state.routes[idx].key,
              canPreventDefault: true,
            })
            if (!focused && !event.defaultPrevented) {
              bottomTabNavigation.navigate({ ...route, merge: true })
            }
          }
          const onLongPress = () => {
            bottomTabNavigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }
          console.log('state.index', state.index, idx, focused)

          return (
            <TabWrapperView focused={idx === state.index} key={`TabWrapperView-${idx}`} onLongPress={onLongPress} onPress={onTabPress}>
              <AnimatedTabBarIcon focused={focused} idx={idx} />
            </TabWrapperView>
          )
        })}
      </View>

      <ReactNativeAnimated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: windowWidth * (state.index * 0.2) + windowWidth / 10,
            transform: [{ translateX: -15 }],
            height: '100%',
            justifyContent: 'center',
            zIndex: 1,
          },
          containerAnimationStyle,
        ]}
      >
        <ReactNativeAnimated.View
          ref={highlightRef}
          style={[
            {
              width: 30,
              height: 30,
              backgroundColor: nameColorMap[state.index],
              borderRadius: 10,
            },
            highlightAnimationStyle,
          ]}
        />
      </ReactNativeAnimated.View>
    </View>
  )
}

export default MainCustomTabBar
