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
import {
  AddWatchListScreen,
  FoodPriceIndexScreen,
  InsiderTransactionListScreen,
  InvestorHoldingListScreen,
  MainScreen,
  PriceTargetListScreen,
  EventListScreen,
  SecFilingListScreen,
  ShortInterestsScreen,
  EUEconomicDataScreen,
  USEconomicDataScreen,
  UnusualOptionsScreen,
  LawsuitScreen,
  LeadershipUpdateScreen,
  OfferingScreen,
  InvestorHoldingDetailScreen,
} from './StockInfo'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabView, SceneMap, Route, TabBar } from 'react-native-tab-view'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import AsianEconomicDataScreen from './StockInfo/AsianEconomicDataScreen'
import { InvestorHolding } from './StockInfo/InvestorHoldingListScreen'

export type StockInfoStackNavigatorParamList = {
  [RouteStacks.stockInfoMain]: undefined
  [RouteStacks.insiderTransactionList]: undefined
  [RouteStacks.priceTargetList]: undefined
  [RouteStacks.secFilingList]: undefined
  [RouteStacks.eventList]: undefined
  [RouteStacks.addWatchList]: undefined
  [RouteStacks.investorHoldingList]: undefined
  [RouteStacks.investorHoldingDetail]: InvestorHolding
  [RouteStacks.shortInterests]: undefined
  [RouteStacks.usEconomicData]: undefined
  [RouteStacks.euEconomicData]: undefined
  [RouteStacks.asianEconomicData]: undefined
  [RouteStacks.globalSupplyChain]: undefined
  [RouteStacks.foodPriceIndex]: undefined
  [RouteStacks.unusualOptions]: undefined
  [RouteStacks.lawsuit]: undefined
  [RouteStacks.leadershipUpdate]: undefined
  [RouteStacks.offering]: undefined
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
      <Stack.Screen name={RouteStacks.investorHoldingList} component={InvestorHoldingListScreen} />
      <Stack.Screen name={RouteStacks.investorHoldingDetail} component={InvestorHoldingDetailScreen} />
      <Stack.Screen name={RouteStacks.shortInterests} component={ShortInterestsScreen} />
      <Stack.Screen name={RouteStacks.usEconomicData} component={USEconomicDataScreen} />
      <Stack.Screen name={RouteStacks.euEconomicData} component={EUEconomicDataScreen} />
      <Stack.Screen name={RouteStacks.asianEconomicData} component={AsianEconomicDataScreen} />
      <Stack.Screen name={RouteStacks.globalSupplyChain} component={SecFilingListScreen} />
      <Stack.Screen name={RouteStacks.foodPriceIndex} component={FoodPriceIndexScreen} />
      <Stack.Screen name={RouteStacks.unusualOptions} component={UnusualOptionsScreen} />
      <Stack.Screen name={RouteStacks.lawsuit} component={LawsuitScreen} />
      <Stack.Screen name={RouteStacks.leadershipUpdate} component={LeadershipUpdateScreen} />
      <Stack.Screen name={RouteStacks.offering} component={OfferingScreen} />
    </Stack.Navigator>
  )
}

export default StockInfoScreen
