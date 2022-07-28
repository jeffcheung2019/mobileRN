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
import { MainTabNavigatorParamList, MainTabNavigatorProps } from '@/Navigators/MainStackNavigator'
import EncryptedStorage from 'react-native-encrypted-storage'
import { MainScreen, NewsDetailScreen } from '@/Screens/App/Home'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { NewsDetail } from './Home/NewsDetailScreen'

const Stack = createSharedElementStackNavigator()

export type HomeScreenNavigatorParamList = {
  [RouteStacks.homeMain]: undefined
  [RouteStacks.homeNewsDetail]: {
    news: NewsDetail
  }
}

export type HomeScreenNavigationProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.home>,
  MainTabNavigatorProps
>

const HomeScreen: FC<HomeScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={RouteStacks.homeMain}>
      <Stack.Screen name={RouteStacks.homeMain} component={MainScreen} />
      <Stack.Screen
        name={RouteStacks.homeNewsDetail}
        component={NewsDetailScreen}
        sharedElements={(route, otherRoute, showing) => {
          const { news } = route.params
          return [
            {
              id: `news.${news?.id}.image`,
              animation: 'fade',
            },
            {
              id: `news.${news?.id}.title`,
              animation: 'fade',
            },
            {
              id: `news.${news?.id}.content`,
              animation: 'fade',
            },
          ]
        }}
      />
    </Stack.Navigator>
  )
}

export default HomeScreen
