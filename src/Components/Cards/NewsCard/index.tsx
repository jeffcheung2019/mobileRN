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
import { forEach, join, map } from 'lodash'
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
import { Avatar, Button, ListItem, Skeleton } from '@rneui/themed'
import InfoCard from '@/Components/InfoCard'
import { headerHeight } from '@/Components/Header'
import { SharedElement } from 'react-navigation-shared-element'
import FastImage from 'react-native-fast-image'

type NewsCardProps = {
  onPress: (newsId: string) => void
  news: {
    id: string
    imgUrl: string
    title: string
    content: string
    tickers: string[]
  }
}

const NewsCard: FC<NewsCardProps> = ({ onPress, news }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const [isLoading, setIsLoading] = useState(true)

  let hasImage = news?.imgUrl !== ''

  return (
    <Animated.View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        marginVertical: 4,
      }}
      entering={FadeInDown}
    >
      <Pressable
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}
        onPress={() => onPress(news?.id)}
      >
        {hasImage && (
          <View
            style={{
              width: '40%',
              backgroundColor: colors.white,
              paddingRight: 10,
            }}
          >
            <SharedElement id={`news.${news?.id}.image`}>
              <FastImage
                source={{
                  uri: news?.imgUrl,
                  priority: FastImage.priority.normal,
                }}
                style={{
                  height: '100%',
                  width: '100%',
                }}
                resizeMode={FastImage.resizeMode.cover}
                onLoadEnd={() => setIsLoading(false)}
              />

              {isLoading && <Skeleton style={{ zIndex: 22, position: 'absolute', top: 0, left: 0, height: '100%' }} animation='pulse' />}
            </SharedElement>
          </View>
        )}

        <View
          style={{
            flex: 4,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <ScrollView
            horizontal
            style={{
              width: '100%',
              height: 40,
            }}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <SharedElement
              id={`news.${news?.id}.tickers.${join(
                news?.tickers.map(ticker => ticker),
                '-',
              )}`}
              style={{
                flexDirection: 'row',
              }}
            >
              {map(news?.tickers, (ticker, idx) => {
                return (
                  <View
                    key={`liveFeedCompanies-${news?.id}-${idx}`}
                    style={{
                      backgroundColor: colors.darkBlueGray,
                      marginRight: 8,
                      height: 30,
                      justifyContent: 'center',
                      paddingHorizontal: 8,
                    }}
                  >
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: colors.white }}>${ticker}</Text>
                  </View>
                )
              })}
            </SharedElement>
          </ScrollView>

          <SharedElement id={`news.${news?.id}.title`}>
            <Text numberOfLines={3} style={[{ color: colors.darkBlueGray, fontWeight: 'bold', fontSize: 14 }]}>
              {news?.title}
            </Text>
          </SharedElement>
        </View>
      </Pressable>
    </Animated.View>
  )
}

export default NewsCard
