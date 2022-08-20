import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, ScrollView, TextStyle, Alert, ViewStyle, useWindowDimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import { createStackNavigator } from '@react-navigation/stack'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { MainTabNavigatorParamList, MainTabNavigatorProps } from '@/Navigators/MainStackNavigator'
import { RouteTopTabs, RouteTabs, RouteStacks } from '@/Navigators/routes'
import { AddWatchListScreen, InsiderTransactionListScreen, MainScreen, PriceTargetListScreen, SecFilingListScreen } from './StockInfo'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabView, SceneMap, Route, TabBar } from 'react-native-tab-view'
import StockInfoMainScreen from './StockInfo/MainScreen'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import EventListScreen from './StockInfo/EventListScreen'

export type StockInfoStackNavigatorParamList = {
  [RouteStacks.stockInfoMain]: undefined
  [RouteStacks.insiderTransactionList]: undefined
  [RouteStacks.priceTargetList]: undefined
  [RouteStacks.secFilingList]: undefined
  [RouteStacks.eventList]: undefined
  [RouteStacks.addWatchList]: undefined
  [RouteStacks.investorHoldingList]: undefined
  [RouteStacks.shortInterests]: undefined
  [RouteStacks.usEconomicData]: undefined
  [RouteStacks.euEconomicData]: undefined
  [RouteStacks.asianEconomicData]: undefined
}

export type StockInfoStackNavigationProps = CompositeScreenProps<
  StackScreenProps<MainTabNavigatorParamList, RouteTabs.stockInfo>,
  MainTabNavigatorProps
>

const Stack = createSharedElementStackNavigator()

const TAB_BAR_TEXT_STYLE = {
  fontSize: 14,
  color: colors.darkBlueGray,
}

type ScreenProps = {}

// allow customizeable
// priceTarget, insidertransaction,
const StockInfoScreen: FC<StockInfoStackNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [screenIdx, setScreenIdx] = useState(0)
  const layout = useWindowDimensions()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }} initialRouteName={RouteStacks.stockInfoMain}>
      <Stack.Screen name={RouteStacks.stockInfoMain} component={MainScreen} />
      <Stack.Screen name={RouteStacks.insiderTransactionList} component={InsiderTransactionListScreen} />
      <Stack.Screen name={RouteStacks.priceTargetList} component={PriceTargetListScreen} />
      <Stack.Screen name={RouteStacks.secFilingList} component={SecFilingListScreen} />
      <Stack.Screen name={RouteStacks.eventList} component={EventListScreen} />
      <Stack.Screen
        name={RouteStacks.addWatchList}
        component={AddWatchListScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}

export default StockInfoScreen
