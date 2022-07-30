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
import ActionButton from '@/Components/Buttons/ActionButton'
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
  FadeInDown,
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
    imgUrl: string
    title: string
    content: string
  }
}

const NewsCard: FC<NewsCardProps> = ({ onPress, news }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()

  return (
    <Animated.View
      style={{
        width: '100%',
        height: '100%',
      }}
      entering={FadeInDown}
    >
      <Pressable
        style={{
          borderWidth: 1,
          borderColor: colors.brightGray,
          flexDirection: 'row',
          padding: 10,
        }}
        onPress={() => onPress(news?.id)}
      >
        <View
          style={{
            height: 100,
            width: '30%',
            backgroundColor: colors.white,
          }}
        >
          <SharedElement id={`news.${news?.id}.image`}>
            <Image
              source={{
                uri: news?.imgUrl === '' ? config.defaultNewsImgUrl : news?.imgUrl,
              }}
              style={{
                resizeMode: 'cover',
                height: 80,
                width: '100%',
              }}
            />
          </SharedElement>
        </View>

        <View
          style={{
            flex: 4,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingHorizontal: 10,
          }}
        >
          <SharedElement id={`news.${news?.id}.title`}>
            <Text numberOfLines={4} style={[{ color: colors.darkBlueGray, fontWeight: 'bold', fontSize: 14 }]}>
              {news?.title}
            </Text>
          </SharedElement>
        </View>
      </Pressable>
    </Animated.View>
  )
}

export default NewsCard
