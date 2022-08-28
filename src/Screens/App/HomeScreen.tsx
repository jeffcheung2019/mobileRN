import React, { useState, useEffect, useCallback, FC } from 'react'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, TouchableOpacity, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login, logout } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { config } from '@/Utils/constants'
import { MainTabNavigatorNavigationProp, MainTabNavigatorParamList, MainTabNavigatorScreenProps } from '@/Navigators/MainStackNavigator'
import EncryptedStorage from 'react-native-encrypted-storage'
import { MainScreen, NewsDetailScreen } from '@/Screens/App/Home'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native'
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { NewsDetail } from './Home/NewsDetailScreen'
import join from 'lodash/join'

const Stack = createSharedElementStackNavigator()

export type HomeScreenNavigatorParamList = {
  [RouteStacks.homeMain]: undefined
  [RouteStacks.homeNewsDetail]: {
    news: NewsDetail
  }
}

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.home>,
  MainTabNavigatorScreenProps
>

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabNavigatorParamList, RouteTabs.home>,
  MainTabNavigatorNavigationProp
>

const HomeScreen: FC<HomeScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
      }}
      initialRouteName={RouteStacks.homeMain}
    >
      <Stack.Screen name={RouteStacks.homeMain} component={MainScreen} />
      <Stack.Screen
        name={RouteStacks.homeNewsDetail}
        component={NewsDetailScreen}
        sharedElements={(route, otherRoute, showing) => {
          const { news } = route.params

          const { tickers, id } = news

          let tickerStr = join(tickers, '-')

          return [
            {
              id: `news.${id}.image`,
              animation: 'fade',
            },
            {
              id: `news.${id}.title`,
              animation: 'fade',
            },
            {
              id: `news.${id}.tickers.${tickerStr}`,
              animation: 'fade',
            },
          ]
        }}
      />
    </Stack.Navigator>
  )
}

export default HomeScreen
