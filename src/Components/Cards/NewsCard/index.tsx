/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback, FC, useRef, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  TextStyle,
  Platform,
  Alert,
  ViewStyle,
  RefreshControl,
  Image,
  Dimensions,
  Linking,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login, logout } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
// @ts-ignore
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { HomeScreenNavigatorParamList } from '@/Screens/App/HomeScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HeaderLayout from '@/Styles/HeaderLayout'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import TurquoiseButton from '@/Components/Buttons/TurquoiseButton'
import CircleButton from '@/Components/Buttons/CircleButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { awsLogout, triggerSnackbar } from '@/Utils/helpers'
import times from 'lodash/times'
// @ts-ignore
import { Auth } from 'aws-amplify'
import axios, { Canceler, CancelTokenSource } from 'axios'
import { RootState } from '@/Store'
import CircularProgress from 'react-native-circular-progress-indicator'
import { startLoading } from '@/Store/UI/actions'

import { Results } from 'realm'
import { forEach, map } from 'lodash'
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { Header } from '@/Components'
import { Avatar, Button, ListItem } from '@rneui/themed'
import InfoCard from '@/Components/InfoCard'
import { headerHeight } from '@/Components/Header'
import { SharedElement } from 'react-navigation-shared-element'

type NewsCardProps = {
  onPress: (newsId: string) => void
  news: {
    id: string
    imgSrc: string
    title: string
    content: string
  }
}

const NewsCard: FC<NewsCardProps> = ({ onPress, news }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()

  return (
    <Pressable
      style={{
        borderWidth: 1,
        borderRadius: 20,
        borderColor: colors.brightGray,
        flexDirection: 'row',
        padding: 10,
      }}
      onPress={() => onPress(news.id)}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <SharedElement id={`news.${news.id}.image`}>
          <Image
            source={{
              uri: news.imgSrc,
            }}
            style={{
              resizeMode: 'cover',
              height: '100%',
              borderRadius: 20,
            }}
          />
        </SharedElement>
      </View>

      <View
        style={{
          flex: 3,
          padding: 10,
        }}
      >
        <SharedElement id={`news.${news.id}.title`}>
          <Text numberOfLines={2} style={[{ color: colors.darkCharcoal, fontWeight: 'bold' }, Fonts.textSM]}>
            {news.title}
          </Text>
        </SharedElement>
        <SharedElement id={`news.${news.id}.content`}>
          <Text numberOfLines={2} style={[{ color: colors.spanishGray }, Fonts.textXS]}>
            {news.content}
          </Text>
        </SharedElement>
      </View>
    </Pressable>
  )
}

export default NewsCard
