import { colors } from '@/Utils/constants'
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps, NavigationHelpers, NavigatorScreenParams, TabNavigationState } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import React, { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Image, Pressable, Text, View } from 'react-native'
import { RouteStacks, RouteTabs, RouteTopTabs } from '@/Navigators/routes'
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
import Animated, {
  interpolate,
  interpolateColor,
  measure,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { times } from 'lodash'

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
    [Key in RouteStacks & RouteTopTabs as string]?: () => React.ReactNode
  }
}

let dimensionRatioTimeout: NodeJS.Timeout

const nameColorMap = [colors.homeTheme, colors.earningTheme, colors.searchTheme, colors.stockInfoTheme, colors.eventTheme]

const MainCustomTabBar: FC<MainCustomTabBarProps> = ({ state, descriptors, navigation: bottomTabNavigation, tabBarIconsMap }) => {
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
    highlightDimensionScale.value = 0.8
    dimensionRatioTimeout = setTimeout(() => {
      highlightDimensionScale.value = 1.5
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
        elevation: 2,
        shadowColor: colors.black,
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
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
          const onTabPress = () => {
            let focused = idx === state.index
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
          return (
            <TabWrapperView focused={idx === state.index} key={`TabWrapperView-${idx}`} onLongPress={onLongPress} onPress={onTabPress}>
              {tabBarIconsMap[state.routeNames[idx]]}
            </TabWrapperView>
          )
        })}
      </View>

      <Animated.View
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
        <Animated.View
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
      </Animated.View>
    </View>
  )
}

export default MainCustomTabBar
