import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import { createStackNavigator } from '@react-navigation/stack'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { config } from '@/Utils/constants'
import { MainTabNavigatorNavigationProp, MainTabNavigatorParamList, MainTabNavigatorScreenProps } from '@/Navigators/MainStackNavigator'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import { MainScreen } from './Search'
import { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native'
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import TickerDetailScreen from './Search/TickerDetailScreen'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import TickerNotiSubscriptionScreen from './Search/TickerNotiSubscriptionScreen'
const Stack = createSharedElementStackNavigator()

export type SearchScreenNavigatorParamList = {
  [RouteStacks.searchMain]: undefined
  [RouteStacks.tickerNotiSubscription]: {
    ticker: string
    name: string
  }
  [RouteStacks.tickerDetail]: {
    ticker: string
    id: number
    name: string
    prevScreen?: {
      tab: keyof MainTabNavigatorParamList
      stack: keyof SearchScreenNavigatorParamList
      params?: any
    }
  }
}

export type SearchScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.search>,
  MainTabNavigatorScreenProps
>
export type SearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabNavigatorParamList, RouteTabs.search>,
  MainTabNavigatorNavigationProp
>

const SearchScreen: FC<SearchScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={RouteStacks.searchMain} component={MainScreen} />
      <Stack.Screen
        name={RouteStacks.tickerNotiSubscription}
        options={{
          presentation: 'modal',
        }}
        component={TickerNotiSubscriptionScreen}
      />
      <Stack.Screen
        name={RouteStacks.tickerDetail}
        component={TickerDetailScreen}
        sharedElements={(route, otherRoute, showing) => {
          const { ticker } = route.params
          return [
            {
              id: `ticker.${ticker}`,
              animation: 'fade',
            },
          ]
        }}
      />
    </Stack.Navigator>
  )
}

export default SearchScreen
