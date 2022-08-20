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
import { MainStackNavigatorParamList, MainStackNavigtorProps } from '@/Navigators/MainStackNavigator'
import { SettingScreenNavigationProps, SettingScreenNavigatorParamList } from '../SettingScreen'
import { NotificationScreenNavigationProps, NotificationScreenNavigatorParamList } from '../NotificationScreen'
import { useRealm } from '@/Realms/RealmContext'
import { TickerDetailDisplay, tickerDetailSectionsStrMap, TickerDetailSectionsType } from '@/Realms/Schemas/TickerDetailDisplaySchema'
import { SectionSubscriptionState } from '../Search/TickerNotiSubscriptionScreen'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export type NotificationMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<NotificationScreenNavigatorParamList, RouteStacks.notificationMain>,
  NotificationScreenNavigationProps
>

type SubscribedTickers = {
  [key: string]: TickerDetailSectionsType
}

const initTickerDetail = {
  priceTargets: false,
  insiderTransactions: false,
  earnings: false,
  secFilings: false,
}

const NotificationMainScreen: FC<NotificationMainScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const realm = useRealm()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [subscribedTickers, setSubscribedTickers] = useState<SubscribedTickers>({})

  const onBackPress = () => {
    navigation.goBack()
  }

  useEffect(() => {
    let realmNotiSubscribedState = realm?.objects<TickerDetailDisplay>('TickerDetailDisplay') ?? []
    let newNotiSubscribedState: SectionSubscriptionState = {
      priceTargets: false,
      earnings: false,
      insiderTransactions: false,
      secFilings: false,
    }
    let newSubscribedTickers: SubscribedTickers = {}
    for (let i = 0; i < realmNotiSubscribedState.length; i++) {
      let sectionStr = tickerDetailSectionsStrMap[realmNotiSubscribedState[i].section]
      let currTicker = realmNotiSubscribedState[i].ticker
      if (realmNotiSubscribedState[i].subscribed) {
        if (newSubscribedTickers[currTicker]) {
          newSubscribedTickers[currTicker] = {
            ...newSubscribedTickers[currTicker],
            [sectionStr]: true,
          }
        } else {
          // first encountered ticker
          newSubscribedTickers[currTicker] = {
            ...initTickerDetail,
            [sectionStr]: true,
          }
        }
      }
    }
    setSubscribedTickers(newSubscribedTickers)
  }, [])

  console.log('subscribedTickers ', JSON.stringify(subscribedTickers, null, 2))

  return (
    <ScreenBackgrounds screenName={RouteStacks.notificationMain}>
      <Header onLeftPress={onBackPress} headerText={t('notifications')} withProfile={false} />
      <KeyboardAwareScrollView
        contentContainerStyle={[
          Layout.fill,
          Layout.colCenter,
          {
            justifyContent: 'flex-start',
          },
        ]}
      >
        {Object.keys(subscribedTickers).map((ticker, idx) => {
          return (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.brightGray,
                paddingVertical: 4,
              }}
              key={`SubscribedTicker-${ticker}`}
              // onPress={() => }
            >
              <View style={{}}>
                <Text
                  style={{
                    color: colors.white,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    fontWeight: 'bold',
                    backgroundColor: colors.darkBlueGray,
                  }}
                >
                  ${ticker}
                </Text>
              </View>

              <View
                style={{
                  flex: 4,
                  paddingHorizontal: 8,
                }}
              >
                <Text>{JSON.stringify(subscribedTickers[ticker])}</Text>
              </View>
            </Pressable>
          )
        })}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default NotificationMainScreen
