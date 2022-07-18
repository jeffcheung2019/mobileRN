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
import AnimateNumber from 'react-native-animate-number'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { HomeScreenNavigatorParamList, HomeScreenNavigationProps } from '@/Screens/App/HomeScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Share from 'react-native-share'
import share from '@/Utils/share'
import HeaderLayout from '@/Styles/HeaderLayout'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import TurquoiseButton from '@/Components/Buttons/TurquoiseButton'
import CircleButton from '@/Components/Buttons/CircleButton'
import Clipboard from '@react-native-clipboard/clipboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import times from 'lodash/times'
// @ts-ignore
import { Auth } from 'aws-amplify'
import axios, { Canceler, CancelTokenSource } from 'axios'
import { RootState } from '@/Store'
import world from '@/Assets/Images/Home/world.png'
import CircularProgress from 'react-native-circular-progress-indicator'
import Svg, { G, Circle } from 'react-native-svg'
import { startLoading } from '@/Store/UI/actions'
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
import NewsCard from '@/Components/Cards/NewsCard'

const PURPLE_COLOR = {
  color: colors.magicPotion,
}

type HomeMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<HomeScreenNavigatorParamList, RouteStacks.homeMain>,
  HomeScreenNavigationProps
>

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const HomeMainScreen: FC<HomeMainScreenNavigationProps> = ({ navigation, route }) => {
  const keyboardAwareScrollViewRef = useRef<Animated.ScrollView>(null)
  const cardsContainerARef: React.LegacyRef<Animated.ScrollView> = useAnimatedRef()
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [needFetchDtl, setNeedFetchDtl] = useState(true)
  const scaleY = useSharedValue(0)

  const onRefresh = () => {
    setNeedFetchDtl(true)
  }

  const onSettingPress = () => {
    navigation.navigate(RouteStacks.setting)
  }

  const scrollPosition = useSharedValue<number>(0)
  const cardsContainerScrollPosition = useSharedValue<number>(0)

  const onCardsContainerScroll = useAnimatedScrollHandler({
    onScroll: event => {
      cardsContainerScrollPosition.value = event.contentOffset.x
    },
  })

  const onContainerScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollPosition.value = event.contentOffset.y
    },
  })

  const cardsContainerAnimatedStyle = useAnimatedStyle(() => {
    scrollPosition
    let cardsContainerMeasuredVal = measure(cardsContainerARef)
    let cardsContainerHeight = cardsContainerMeasuredVal.height
    let cardsContainerOffsetY = cardsContainerMeasuredVal.pageY - headerHeight
    return {
      opacity: cardsContainerOffsetY < 0 ? ((cardsContainerOffsetY + cardsContainerHeight) * 0.5) / cardsContainerHeight : 1,
    }
  }, [scrollPosition])

  useEffect(() => {
    setTimeout(() => {
      setNeedFetchDtl(false)
    }, 600)
  }, [needFetchDtl])

  return (
    <ScreenBackgrounds screenName={RouteStacks.homeMain}>
      <Header
        headerText={t('home')}
        onRightPress={onSettingPress}
        rightIcon={() => <Ionicons name='settings' size={22} color={colors.darkCharcoal} />}
      />

      <Animated.ScrollView
        ref={keyboardAwareScrollViewRef}
        scrollEventThrottle={1000 / 60}
        onScroll={onContainerScroll}
        contentContainerStyle={[Layout.colCenter]}
        refreshControl={
          <RefreshControl refreshing={needFetchDtl} onRefresh={onRefresh} progressViewOffset={10} tintColor={colors.skyBlueCrayola} />
        }
      >
        <Animated.ScrollView
          ref={cardsContainerARef}
          horizontal={true}
          scrollEventThrottle={1000 / 60}
          onScroll={onCardsContainerScroll}
          showsHorizontalScrollIndicator={false}
          style={[{}, cardsContainerAnimatedStyle]}
        >
          {map(
            [
              {
                ticker: 'AAPL',
                companyName: 'Apple',
              },
              {
                ticker: 'GOOG',
                companyName: 'Alphabet',
              },
              {
                ticker: 'MSFT',
                companyName: 'Microsoft',
              },
              {
                ticker: 'TSLA',
                companyName: 'Tesla',
              },
            ],
            (elem, idx) => {
              return (
                <View
                  key={`InfoCard-${idx}`}
                  style={[
                    {
                      margin: 8,
                    },
                  ]}
                >
                  <InfoCard
                    cardIdx={idx}
                    ticker={elem.ticker}
                    companyName={elem.companyName}
                    scrollPosition={cardsContainerScrollPosition}
                  />
                </View>
              )
            },
          )}
        </Animated.ScrollView>

        <Animated.ScrollView style={{ width: '100%' }} horizontal={false} showsVerticalScrollIndicator={false}>
          <NewsCard
            news={{
              id: '5kfo9',
              title: 'Stock market news live updates: Stocks sink as ...',
              content: 'U.S. stocks fell Thursday as investors reeled from shock inflation data and digested earnings from some of ...',
              imgSrc:
                'https://s.yimg.com/ny/api/res/1.2/WOmeLDvf.Zt7ctFXe8Zp3Q--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtjZj13ZWJw/https://s.yimg.com/os/creatr-uploaded-images/2021-04/d26cbc90-97ad-11eb-aff9-9a8220236e3c',
            }}
            onPress={() =>
              navigation.navigate(RouteStacks.homeNewsDetail, {
                news: {
                  id: '5kfo9',
                  title: 'Stock market news live updates: Stocks sink as ...',
                  content: 'U.S. stocks fell Thursday as investors reeled from shock inflation data and digested earnings from some of ...',
                  imgSrc:
                    'https://s.yimg.com/ny/api/res/1.2/WOmeLDvf.Zt7ctFXe8Zp3Q--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtjZj13ZWJw/https://s.yimg.com/os/creatr-uploaded-images/2021-04/d26cbc90-97ad-11eb-aff9-9a8220236e3c',
                },
              })
            }
          />
          {/* <NewsCard
            news={{
              id: '5kf19',
              title: 'Stock market news live updates: Stocks sink as ...',
              content: 'U.S. stocks fell Thursday as investors reeled from shock inflation data and digested earnings from some of ...',
              imgSrc:
                'https://s.yimg.com/ny/api/res/1.2/WOmeLDvf.Zt7ctFXe8Zp3Q--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtjZj13ZWJw/https://s.yimg.com/os/creatr-uploaded-images/2021-04/d26cbc90-97ad-11eb-aff9-9a8220236e3c',
            }}
            onPress={() =>
              navigation.navigate(RouteStacks.homeNewsDetail, {
                news: {
                  id: '5kfo9',
                  title: 'Stock market news live updates: Stocks sink as ...',
                  content: 'U.S. stocks fell Thursday as investors reeled from shock inflation data and digested earnings from some of ...',
                  imgSrc:
                    'https://s.yimg.com/ny/api/res/1.2/WOmeLDvf.Zt7ctFXe8Zp3Q--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtjZj13ZWJw/https://s.yimg.com/os/creatr-uploaded-images/2021-04/d26cbc90-97ad-11eb-aff9-9a8220236e3c',
                }
              })
            }
          /> */}
        </Animated.ScrollView>
      </Animated.ScrollView>
    </ScreenBackgrounds>
  )
}

export default HomeMainScreen
