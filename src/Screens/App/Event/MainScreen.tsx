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
import { RouteStacks } from '@/Navigators/routes'
import { CompositeScreenProps } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { EventScreenNavigationProps, EventScreenNavigatorParamList } from '../EventScreen'

type EventMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<EventScreenNavigatorParamList, RouteStacks.eventMain>,
  EventScreenNavigationProps
>

const EventMainScreen: FC<EventMainScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <ScreenBackgrounds screenName={RouteStacks.eventMain}>
      <KeyboardAwareScrollView style={Layout.fill} contentContainerStyle={[Layout.fill, Layout.colCenter, Gutters.smallHPadding]}>
        <Text style={{ color: colors.black }}>Event</Text>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default EventMainScreen
