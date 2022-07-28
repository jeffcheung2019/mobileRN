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
import { MainStackNavigatorParamList, MainStackNavigtorProps } from '@/Navigators/MainStackNavigator'
import { MainScreen } from './Notification'
import NotificationDetailScreen from './Notification/NotificationDetailScreen'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export type NotificationScreenNavigatorParamList = {
  [RouteStacks.notificationMain]: undefined
  [RouteStacks.notificationDetail]: undefined
}

export type NotificationScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<MainStackNavigatorParamList, RouteStacks.notification>,
  MainStackNavigtorProps
>

const Stack = createSharedElementStackNavigator()

const NotificationScreen: FC<NotificationScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={RouteStacks.notificationMain}
        component={MainScreen}
        sharedElements={(route, otherRoute, showing) => {
          const { noti } = route.params
          return [
            {
              id: `noti.${noti?.id}`,
              animation: 'fade',
            },
          ]
        }}
      />
      <Stack.Screen name={RouteStacks.notificationDetail} component={NotificationDetailScreen} />
    </Stack.Navigator>
  )
}

export default NotificationScreen
