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
import { StockInfoTopTabNavigatorParamList, StockInfoTopTabNavigationProps } from '@/Screens/App/StockInfoScreen'
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export type StockInfoMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<StockInfoTopTabNavigatorParamList, RouteTopTabs.stockInfoMain>,
  StockInfoTopTabNavigationProps
>

const StockInfoMainScreen: FC<StockInfoMainScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <ScreenBackgrounds screenName={RouteTopTabs.stockInfoMain}>
      <KeyboardAwareScrollView style={Layout.fill} contentContainerStyle={[Layout.fullSize, Layout.colCenter, Gutters.smallHPadding]}>
        {/* <DraggableCards /> */}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default StockInfoMainScreen
