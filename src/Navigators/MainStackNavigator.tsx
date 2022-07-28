import React, { FC, useEffect } from 'react'
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useTranslation } from 'react-i18next'
import { colors, config } from '@/Utils/constants'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { RouteStacks, RouteTabs } from './routes'

import { Dimensions, ImageBackground, Text, TextStyle, View, ViewStyle } from 'react-native'
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { Auth } from 'aws-amplify'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/Store/Users/actions'
import { awsLogout } from '@/Utils/helpers'
import { WelcomeGalleryScreen } from '@/Screens/Auth'
import { RootState } from '@/Store'

import { ApplicationNavigatorParamList } from './Application'

import Foundation from 'react-native-vector-icons/Foundation'

import HomeScreen, { HomeScreenNavigatorParamList } from '@/Screens/App/HomeScreen'
import EarningScreen, { EarningScreenNavigatorParamList } from '@/Screens/App/EarningScreen'
import SearchScreen, { SearchScreenNavigatorParamList } from '@/Screens/App/SearchScreen'
import SettingScreen, { SettingScreenNavigatorParamList } from '@/Screens/App/SettingScreen'
import NotificationScreen, { NotificationScreenNavigatorParamList } from '@/Screens/App/NotificationScreen'
import MainCustomTabBar from './MainCustomTabBar'
import Animated from 'react-native-reanimated'
import { t } from 'i18next'
import { startLoading } from '@/Store/UI/actions'
import EventScreen, { EventScreenNavigatorParamList } from '@/Screens/App/EventScreen'
import StockInfoScreen, { StockInfoTopTabNavigatorParamList } from '@/Screens/App/StockInfoScreen'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

export type MainStackNavigtorProps = StackScreenProps<ApplicationNavigatorParamList, RouteStacks.mainStack>
export type MainStackNavigatorParamList = {
  [RouteStacks.mainTab]: NavigatorScreenParams<MainTabNavigatorParamList>
  [RouteStacks.setting]: NavigatorScreenParams<SettingScreenNavigatorParamList>
  [RouteStacks.notification]: NavigatorScreenParams<NotificationScreenNavigatorParamList>
  // [RouteStacks.mainTab]: undefined
  // [RouteStacks.setting]: undefined
}

export type MainTabNavigatorParamList = {
  [RouteTabs.home]: NavigatorScreenParams<HomeScreenNavigatorParamList>
  [RouteTabs.earning]: NavigatorScreenParams<EarningScreenNavigatorParamList>
  [RouteTabs.search]: NavigatorScreenParams<SearchScreenNavigatorParamList>
  [RouteTabs.stockInfo]: NavigatorScreenParams<StockInfoTopTabNavigatorParamList>
  [RouteTabs.event]: NavigatorScreenParams<EventScreenNavigatorParamList>
  // 🔥 Your screens go here
}

export type MainTabNavigatorProps = CompositeScreenProps<
  StackScreenProps<MainStackNavigatorParamList, RouteStacks.mainTab>,
  MainStackNavigtorProps
>

const TABBAR_ICON_VIEW: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
}

const MainTabNavigator: FC<MainTabNavigatorProps> = ({ navigation }) => {
  const tabBarIconsMap: {
    [Key in RouteStacks as string]?: () => React.ReactNode
  } = {
    home: () => (
      <View style={TABBAR_ICON_VIEW}>
        <MaterialIcons name='home' size={config.iconSize} color={colors.darkBlueGray} />
      </View>
    ),
    earning: () => (
      <View style={TABBAR_ICON_VIEW}>
        <MaterialCommunityIcons name='calendar-multiselect' size={config.iconSize} color={colors.darkBlueGray} />
      </View>
    ),
    search: () => (
      <View style={TABBAR_ICON_VIEW}>
        <MaterialIcons name='search' size={config.iconSize} color={colors.darkBlueGray} />
      </View>
    ),
    stockInfo: () => (
      <View style={TABBAR_ICON_VIEW}>
        <Foundation name='results' size={config.iconSize} color={colors.darkBlueGray} />
      </View>
    ),
    event: () => (
      <View style={TABBAR_ICON_VIEW}>
        <MaterialIcons name='announcement' size={config.iconSize} color={colors.darkBlueGray} />
      </View>
    ),
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={RouteTabs.stockInfo}
      tabBar={(bottomTabBarProps: BottomTabBarProps) => <MainCustomTabBar {...bottomTabBarProps} tabBarIconsMap={tabBarIconsMap} />}
    >
      <Tab.Screen name={RouteTabs.home} component={HomeScreen} />
      <Tab.Screen name={RouteTabs.earning} component={EarningScreen} />
      <Tab.Screen name={RouteTabs.search} component={SearchScreen} />
      <Tab.Screen name={RouteTabs.stockInfo} component={StockInfoScreen} />
      <Tab.Screen name={RouteTabs.event} component={EventScreen} />
    </Tab.Navigator>
  )
}

const MainStackNavigator: FC<MainStackNavigtorProps> = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={RouteStacks.mainTab}>
      <Stack.Screen name={RouteStacks.mainTab} component={MainTabNavigator} />
      <Stack.Screen name={RouteStacks.setting} component={SettingScreen} />
      <Stack.Screen name={RouteStacks.notification} component={NotificationScreen} />
    </Stack.Navigator>
  )
}

export default MainStackNavigator
