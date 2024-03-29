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
import { MainScreen } from './StockQuote'
import { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native'
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import AddStockQuoteScreen from './StockQuote/AddStockQuoteScreen'

const Stack = createStackNavigator()

export type StockQuoteScreenNavigatorParamList = {
  [RouteStacks.stockQuoteMain]: undefined
  [RouteStacks.addStockQuote]: {
    tabName: string
  }
}

export type StockQuoteScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.stockQuote>,
  MainTabNavigatorScreenProps
>

export type StockQuoteScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabNavigatorParamList, RouteTabs.stockQuote>,
  MainTabNavigatorNavigationProp
>

const StockQuoteScreen: FC<StockQuoteScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }}>
      <Stack.Screen name={RouteStacks.stockQuoteMain} component={MainScreen} />
      <Stack.Screen
        name={RouteStacks.addStockQuote}
        component={AddStockQuoteScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}

export default StockQuoteScreen
