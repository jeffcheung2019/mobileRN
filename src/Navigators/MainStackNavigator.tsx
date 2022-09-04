import React, { FC, useEffect } from 'react'
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useTranslation } from 'react-i18next'
import { colors, config } from '@/Utils/constants'
import { createStackNavigator, StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { RouteStacks, RouteTabs } from './routes'

import { Dimensions, ImageBackground, Text, TextStyle, View, ViewStyle } from 'react-native'
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  EventArg,
  EventMapBase,
  EventMapCore,
  NavigatorScreenParams,
} from '@react-navigation/native'
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
import StockQuoteScreen, { StockQuoteScreenNavigatorParamList } from '@/Screens/App/StockQuoteScreen'
import StockInfoScreen, { StockInfoScreenNavigatorParamList } from '@/Screens/App/StockInfoScreen'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import AppSplashScreen from '@/Screens/AppSplashScreen'

const Tab = createBottomTabNavigator()
const Stack = createSharedElementStackNavigator()

export type MainStackNavigtorScreenProps = StackScreenProps<ApplicationNavigatorParamList, RouteStacks.mainStack>
export type MainStackNavigtorNavigationProp = StackNavigationProp<ApplicationNavigatorParamList, RouteStacks.mainStack>

export type MainStackNavigatorParamList = {
  [RouteStacks.mainTab]: NavigatorScreenParams<MainTabNavigatorParamList>
  [RouteStacks.setting]: NavigatorScreenParams<SettingScreenNavigatorParamList>
  [RouteStacks.appSplashScreen]: undefined
  [RouteStacks.notification]: NavigatorScreenParams<NotificationScreenNavigatorParamList>
}

export type MainTabNavigatorParamList = {
  [RouteTabs.home]: NavigatorScreenParams<HomeScreenNavigatorParamList>
  [RouteTabs.earning]: NavigatorScreenParams<EarningScreenNavigatorParamList>
  [RouteTabs.search]: NavigatorScreenParams<SearchScreenNavigatorParamList>
  [RouteTabs.stockInfo]: NavigatorScreenParams<StockInfoScreenNavigatorParamList>
  [RouteTabs.stockQuote]: NavigatorScreenParams<StockQuoteScreenNavigatorParamList>
}

export type MainTabNavigatorScreenProps = CompositeScreenProps<
  StackScreenProps<MainStackNavigatorParamList, RouteStacks.mainTab>,
  MainStackNavigtorScreenProps
>

export type MainTabNavigatorNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackNavigatorParamList, RouteStacks.mainTab>,
  MainStackNavigtorNavigationProp
>

const TABBAR_ICON_VIEW: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
}

const MainTabNavigator: FC<MainTabNavigatorScreenProps> = ({ navigation }) => {
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
    stockQuote: () => (
      <View style={TABBAR_ICON_VIEW}>
        <MaterialCommunityIcons name='chart-areaspline' size={config.iconSize} color={colors.darkBlueGray} />
      </View>
    ),
  }

  return (
    <View
      style={{
        backgroundColor: colors.white,
        justifyContent: 'flex-end',
        flex: 1,
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={RouteTabs.home}
        tabBar={(bottomTabBarProps: BottomTabBarProps) => <MainCustomTabBar {...bottomTabBarProps} tabBarIconsMap={tabBarIconsMap} />}
      >
        <Tab.Screen name={RouteTabs.home} component={HomeScreen} />
        <Tab.Screen name={RouteTabs.earning} component={EarningScreen} />
        <Tab.Screen
          name={RouteTabs.search}
          component={SearchScreen}
          listeners={({ navigation, route }) => {
            return {
              tabPress: (e: any) => {
                // To force the tab press always redirect user to RouteStacks.searchMain is essential
                e.preventDefault()
                navigation.navigate(RouteStacks.searchMain)
              },
            }
          }}
        />
        <Tab.Screen name={RouteTabs.stockInfo} component={StockInfoScreen} />
        <Tab.Screen name={RouteTabs.stockQuote} component={StockQuoteScreen} />
      </Tab.Navigator>
    </View>
  )
}

const MainStackNavigator: FC<MainStackNavigtorScreenProps> = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName={RouteStacks.appSplashScreen}
    >
      <Stack.Screen
        name={RouteStacks.appSplashScreen}
        component={AppSplashScreen}
        options={{
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name={RouteStacks.mainTab}
        options={{
          presentation: 'transparentModal',
        }}
        component={MainTabNavigator}
      />
      <Stack.Screen
        name={RouteStacks.setting}
        options={{
          presentation: 'modal',
        }}
        component={SettingScreen}
      />
      <Stack.Screen
        name={RouteStacks.notification}
        options={{
          presentation: 'modal',
        }}
        component={NotificationScreen}
      />
    </Stack.Navigator>
  )
}

export default MainStackNavigator
