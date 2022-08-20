import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { RouteStacks, RouteTopTabs } from '@/Navigators/routes'
import { CompositeScreenProps } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SharedElement } from 'react-navigation-shared-element'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import DraggableCard from '@/Components/Buttons/Draggable/DraggableCard'
import DraggableCards from '@/Components/Buttons/Draggable/DraggableCard'
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import { StockInfoStackNavigatorParamList, StockInfoStackNavigationProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'

export type PriceTargetListScreenNavigationProps = CompositeScreenProps<
  MaterialTopTabScreenProps<StockInfoStackNavigatorParamList, RouteStacks.insiderTransactionList>,
  StockInfoStackNavigationProps
>

const PriceTargetListScreen: FC<PriceTargetListScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <ScreenBackgrounds screenName={RouteStacks.priceTargetList}>
      <Header headerText={t('priceTargets')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
      <KeyboardAwareScrollView
        style={Layout.fill}
        contentContainerStyle={[Layout.fullSize, Layout.colCenter, Gutters.smallHPadding]}
      ></KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default PriceTargetListScreen
