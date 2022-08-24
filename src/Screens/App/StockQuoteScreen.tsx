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
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import { MainScreen } from './StockQuote'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import AddStockQuoteScreen from './StockQuote/AddStockQuoteScreen'

const Stack = createStackNavigator()

export type StockQuoteScreenNavigatorParamList = {
  [RouteStacks.stockQuoteMain]: undefined
  [RouteStacks.addStockQuote]: undefined
}

export type StockQuoteScreenNavigationProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.stockQuote>,
  MainTabNavigatorProps
>

const StockQuoteScreen: FC<StockQuoteScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={RouteStacks.stockQuoteMain} component={MainScreen} />
      <Stack.Screen name={RouteStacks.addStockQuote} component={AddStockQuoteScreen} />
    </Stack.Navigator>
  )
}

export default StockQuoteScreen
