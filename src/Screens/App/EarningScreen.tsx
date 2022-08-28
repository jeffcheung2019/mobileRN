import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
  TextStyle,
  Alert,
  ViewStyle,
  useWindowDimensions,
  Pressable,
  Dimensions,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import { createStackNavigator } from '@react-navigation/stack'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { MainTabNavigatorNavigationProp, MainTabNavigatorParamList, MainTabNavigatorScreenProps } from '@/Navigators/MainStackNavigator'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import { MainScreen } from './Earning'
import { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native'
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { Route, TabBar, TabView } from 'react-native-tab-view'
import EarningMainScreen from './Earning/MainScreen'
import EarningWeekDayContainer from './Earning/EarningWeekDayContainer'
import { Skeleton } from '@rneui/themed'
import { map, times } from 'lodash'
import { CancelableSWRResult, useCancelableSWR } from '@/Utils/swrUtils'
import { tradingViewEarningApi } from '@/Utils/apiUtils'
import useSWR, { SWRConfiguration } from 'swr'
import axios from 'axios'
import useSWRImmutable from 'swr/immutable'
const Stack = createStackNavigator()
const windowWidth = Dimensions.get('window').width

export type EarningScreenNavigatorParamList = {
  [RouteStacks.earningMain]: undefined
}

export type EarningScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.earning>,
  MainTabNavigatorScreenProps
>
export type EarningScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabNavigatorParamList, RouteTabs.earning>,
  MainTabNavigatorNavigationProp
>

type SceneRoute = {
  route: {
    key: string
  }
}

const weekDayStr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const EarningScreen: FC<EarningScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={RouteStacks.earningMain} component={EarningMainScreen} />
      {/* <Stack.Screen name={RouteStacks.earningMain} component={EarningMainScreen} /> */}
    </Stack.Navigator>
  )
}

export default EarningScreen
