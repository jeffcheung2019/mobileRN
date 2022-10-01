import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, ScrollView, TextStyle, Alert, ViewStyle, useWindowDimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import { createStackNavigator } from '@react-navigation/stack'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { MainTabNavigatorNavigationProp, MainTabNavigatorParamList, MainTabNavigatorScreenProps } from '@/Navigators/MainStackNavigator'
import { RouteTabs, RouteStacks } from '@/Navigators/routes'
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
  LawsuitsScreen,
  LeadershipUpdateScreen,
  OfferingScreen,
  InvestorHoldingDetailScreen,
  OfferingDetailScreen,
  LawsuitsDetailScreen,
  IPONewsDetailScreen,
} from './StockInfo'
import { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native'
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabView, SceneMap, Route, TabBar } from 'react-native-tab-view'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import AsianEconomicDataScreen from './StockInfo/AsianEconomicDataScreen'
import { InvestorHolding } from './StockInfo/InvestorHoldingListScreen'
import ShortResearchReportsScreen from './StockInfo/ShortResearchReportsScreen'
import ShortResearchReportsDetailScreen from './StockInfo/ShortResearchReportsDetailScreen'
import MergerAcquisitionScreen from './StockInfo/MergerAcquistionScreen'
import MergerAcquisitionDetailScreen from './StockInfo/MergerAcquistionDetailScreen'
import { LawsuitNewsDetail } from './StockInfo/LawsuitsDetailScreen'
import join from 'lodash/join'
import GlobalSupplyChainScreen from './StockInfo/GlobalSupplyChainScreen'
import IPONewsScreen from './StockInfo/IPONewsScreen'
import CpiIndexScreen from './StockInfo/CpiIndexScreen'

export type StockInfoScreenNavigatorParamList = {
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
  [RouteStacks.lawsuits]: undefined
  [RouteStacks.lawsuitsDetail]: {
    news: LawsuitNewsDetail
  }
  [RouteStacks.leadershipUpdate]: undefined
  [RouteStacks.offering]: undefined
  [RouteStacks.offeringDetail]: {
    url: string
    title: string
    tickers: {
      tickerName: string
      companyName: string
    }[]
  }
  [RouteStacks.shortResearchReports]: undefined
  [RouteStacks.shortResearchReportsDetail]: undefined
  [RouteStacks.mergerAcquisition]: undefined
  [RouteStacks.mergerAcquisitionDetail]: undefined
  [RouteStacks.ipoNews]: undefined
  [RouteStacks.ipoNewsDetail]: undefined
  [RouteStacks.cpiIndex]: undefined
}

export type StockInfoStackScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.stockInfo>,
  MainTabNavigatorScreenProps
>

export type StockInfoStackScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabNavigatorParamList, RouteTabs.stockInfo>,
  MainTabNavigatorNavigationProp
>

const Stack = createSharedElementStackNavigator<StockInfoScreenNavigatorParamList>()

const TAB_BAR_TEXT_STYLE = {
  fontSize: 14,
  color: colors.darkBlueGray,
}

type ScreenProps = {}

// allow customizeable
// priceTarget, insidertransaction,
const StockInfoScreen: FC<StockInfoStackScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [screenIdx, setScreenIdx] = useState(0)
  const layout = useWindowDimensions()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
      }}
      initialRouteName={RouteStacks.stockInfoMain}
    >
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
      <Stack.Screen name={RouteStacks.globalSupplyChain} component={GlobalSupplyChainScreen} />
      <Stack.Screen name={RouteStacks.foodPriceIndex} component={FoodPriceIndexScreen} />
      <Stack.Screen name={RouteStacks.unusualOptions} component={UnusualOptionsScreen} />
      <Stack.Screen name={RouteStacks.lawsuits} component={LawsuitsScreen} />
      <Stack.Screen
        name={RouteStacks.lawsuitsDetail}
        component={LawsuitsDetailScreen}
        options={{
          presentation: 'card',
        }}
        sharedElements={(route, otherRoute, showing) => {
          const { news } = route.params
          const { tickers, id } = news

          let tickerStr = join(tickers, '-')

          return [
            {
              id: `lawsuitNews.${id}.image`,
              animation: 'fade',
            },
            {
              id: `lawsuitNews.${id}.title`,
              animation: 'fade',
            },
            {
              id: `lawsuitNews.${id}.tickers.${tickerStr}`,
              animation: 'fade',
            },
          ]
        }}
      />
      <Stack.Screen name={RouteStacks.leadershipUpdate} component={LeadershipUpdateScreen} />
      <Stack.Screen name={RouteStacks.offering} component={OfferingScreen} />
      <Stack.Screen name={RouteStacks.offeringDetail} component={OfferingDetailScreen} />
      <Stack.Screen name={RouteStacks.shortResearchReports} component={ShortResearchReportsScreen} />
      <Stack.Screen name={RouteStacks.shortResearchReportsDetail} component={ShortResearchReportsDetailScreen} />
      <Stack.Screen name={RouteStacks.mergerAcquisition} component={MergerAcquisitionScreen} />
      <Stack.Screen name={RouteStacks.mergerAcquisitionDetail} component={MergerAcquisitionDetailScreen} />
      <Stack.Screen name={RouteStacks.ipoNews} component={IPONewsScreen} />
      <Stack.Screen name={RouteStacks.ipoNewsDetail} component={IPONewsDetailScreen} />
      <Stack.Screen name={RouteStacks.cpiIndex} component={CpiIndexScreen} />
    </Stack.Navigator>
  )
}

export default StockInfoScreen
