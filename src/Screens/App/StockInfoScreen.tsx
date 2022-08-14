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
import { RouteTopTabs, RouteTabs } from '@/Navigators/routes'
import { InsiderScreen, MainScreen } from './StockInfo'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabView, SceneMap, Route, TabBar } from 'react-native-tab-view'
import StockInfoMainScreen from './StockInfo/MainScreen'

const MaterialTopTab = createMaterialTopTabNavigator()

export type StockInfoTopTabNavigatorParamList = {
  [RouteTopTabs.stockInfoMain]: undefined
  [RouteTopTabs.insider]: undefined
}

export type StockInfoTopTabNavigationProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.stockInfo>,
  MainTabNavigatorProps
>

const TAB_BAR_TEXT_STYLE = {
  fontSize: 14,
  color: colors.darkBlueGray,
}

type ScreenProps = {}

const StockInfoScreen: FC<StockInfoTopTabNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [screenIdx, setScreenIdx] = useState(0)
  const layout = useWindowDimensions()
  const [screens] = useState([{ key: 'Price Target' }, { key: 'Insider' }])

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'Price Target':
        return StockInfoMainScreen
      case 'Insider':
        return InsiderScreen
      default:
        return null
    }
  }


  return (
    <TabView
      style={{
        width: '100%',
        height: '100%',
      }}
      lazy
      lazyPreloadDistance={10}
      renderTabBar={props => (
        <TabBar
          {...props}
          scrollEnabled
          renderLabel={props => {
            const { focused, route } = props
            return (
              <View>
                <Text style={{ color: colors.darkBlueGray }}>{route?.key}</Text>
              </View>
            )
          }}
          indicatorStyle={{ backgroundColor: colors.darkBlueGray }}
          style={{ backgroundColor: colors.white }}
        />
      )}
      navigationState={{ index: screenIdx, routes: screens }}
      renderScene={renderScene}
      onIndexChange={setScreenIdx}
      sceneContainerStyle={{}}
      initialLayout={{ width: layout.width }}
    />
  )
}

export default StockInfoScreen
