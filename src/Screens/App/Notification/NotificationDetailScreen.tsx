import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, Text, ScrollView, TextStyle, Alert, ViewStyle, Pressable, Image, Dimensions, PressableProps } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { RouteStacks } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ActionButton from '@/Components/Buttons/ActionButton'
import { Header } from '@/Components'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { MainStackNavigatorParamList, MainTabNavigatorScreenProps } from '@/Navigators/MainStackNavigator'
import { SettingScreenProps, SettingScreenNavigatorParamList } from '../SettingScreen'
import { NotificationScreenProps, NotificationScreenNavigatorParamList } from '../NotificationScreen'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export type NotificationDetailScreenProps = CompositeScreenProps<
  StackScreenProps<NotificationScreenNavigatorParamList, RouteStacks.notificationDetail>,
  NotificationScreenProps
>

const NotificationDetailScreen: FC<NotificationDetailScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const params = route!.params || { title: null }

  const onBackPress = () => {
    navigation.goBack()
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.notificationDetail}>
      <Header onLeftPress={onBackPress} headerText={params?.title ?? ''} withProfile={false} />
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter]}></KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default NotificationDetailScreen
