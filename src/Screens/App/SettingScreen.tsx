import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { RouteStacks } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Header } from '@/Components'
import { CompositeScreenProps } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { MainStackNavigatorParamList, MainTabNavigatorScreenProps } from '@/Navigators/MainStackNavigator'
import { MainScreen, SettingEditProfileScreen } from './Setting'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export type SettingScreenNavigatorParamList = {
  [RouteStacks.settingMain]: undefined
  [RouteStacks.settingEditProfile]: undefined
}

export type SettingScreenProps = CompositeScreenProps<
  StackScreenProps<MainStackNavigatorParamList, RouteStacks.setting>,
  MainTabNavigatorScreenProps
>

const Stack = createStackNavigator()

const SettingScreen: FC<SettingScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={RouteStacks.settingMain} component={MainScreen} />
      <Stack.Screen name={RouteStacks.settingEditProfile} component={SettingEditProfileScreen} />
    </Stack.Navigator>
  )
}

export default SettingScreen
