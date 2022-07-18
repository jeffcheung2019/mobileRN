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
import { MainTabNavigatorParamList, MainTabNavigatorProps } from '@/Navigators/MainStackNavigator'
import { RouteTopTabs, RouteTabs } from '@/Navigators/routes'
import { InsiderScreen, MainScreen } from './StockInfo'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
const MaterialTopTab = createMaterialTopTabNavigator()

export type StockInfoTopTabNavigatorParamList = {
  [RouteTopTabs.stockInfoMain]: undefined
  [RouteTopTabs.insider]: undefined
}

export type StockInfoTopTabNavigationProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.stockInfo>,
  MainTabNavigatorProps
>

const StockInfoScreen: FC<StockInfoTopTabNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <MaterialTopTab.Navigator initialRouteName={RouteTopTabs.stockInfoMain}>
      <MaterialTopTab.Screen name={RouteTopTabs.stockInfoMain} component={MainScreen} />
      <MaterialTopTab.Screen name={RouteTopTabs.insider} component={InsiderScreen} />
    </MaterialTopTab.Navigator>
  )
}

export default StockInfoScreen
