import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { View, ActivityIndicator, Text, TextInput, ScrollView, TextStyle, Alert, ViewStyle, Pressable, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { MainTabNavigatorParamList, MainTabNavigatorScreenProps } from '@/Navigators/MainStackNavigator'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ActionButton from '@/Components/Buttons/ActionButton'
import { Header } from '@/Components'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { CompositeScreenProps } from '@react-navigation/native'
import { gql, useQuery } from '@apollo/client'
import map from 'lodash/map'
import { StackScreenProps } from '@react-navigation/stack'
import { SearchScreenProps, SearchScreenNavigatorParamList } from '../SearchScreen'
import { getTickers } from '@/Queries/SearchTab'
import { SharedElement } from 'react-navigation-shared-element'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import BrightGrayInput from '@/Components/Inputs/BrightGrayInput'
import { Switch } from '@rneui/themed'
import { useRealm } from '@/Realms/RealmContext'
import ObjectId from 'bson-objectid'
import { TickerDetailSections, TickerDetailDisplay, tickerDetailSectionsStrMap } from '@/Realms/Schemas/SearchTab/TickerDetailDisplaySchema'
import { UpdateMode } from 'realm'

export type TickerNotiSubscriptionScreenProps = CompositeScreenProps<
  StackScreenProps<SearchScreenNavigatorParamList, RouteStacks.tickerNotiSubscription>,
  SearchScreenProps
>
export type SectionSubscriptionState = {
  [key: string]: boolean
}

const SWITCH_SECTION_VIEW: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 16,
}

const notificationSections: {
  section: TickerDetailSections
  sectionString: string
}[] = [
  {
    section: TickerDetailSections.priceTargets,
    sectionString: 'priceTargets',
  },
  {
    section: TickerDetailSections.earnings,
    sectionString: 'earnings',
  },
  {
    section: TickerDetailSections.insiderTransactions,
    sectionString: 'insiderTransactions',
  },
  {
    section: TickerDetailSections.secFilings,
    sectionString: 'secFilings',
  },
]

const TickerNotiSubscriptionScreen: FC<TickerNotiSubscriptionScreenProps> = ({ navigation, route }) => {
  const realm = useRealm()
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const { ticker, name } = route?.params

  const [notiSubscribed, setNotiSubscribed] = useState<SectionSubscriptionState>({
    priceTargets: false,
    earnings: false,
    insiderTransactions: false,
    secFilings: false,
  })

  useEffect(() => {
    const run = async () => {
      let realmNotiSubscribedState = realm?.objects<TickerDetailDisplay>('TickerDetailDisplay').filtered(`ticker = '${ticker}'`) ?? []
      let newNotiSubscribedState: SectionSubscriptionState = {
        priceTargets: false,
        earnings: false,
        insiderTransactions: false,
        secFilings: false,
      }
      for (let i = 0; i < realmNotiSubscribedState.length; i++) {
        if (realmNotiSubscribedState[i].subscribed) {
          let sectionStr = tickerDetailSectionsStrMap[realmNotiSubscribedState[i].section]
          newNotiSubscribedState[sectionStr] = true
        }
      }

      setNotiSubscribed(newNotiSubscribedState)
    }

    run()
  }, [])

  const updateSectionDisplay = async (section: TickerDetailSections) => {
    let sectionNewState = !notiSubscribed[tickerDetailSectionsStrMap[section]]
    try {
      realm?.write(() => {
        let matchedTickerDisplays = realm
          .objects<TickerDetailDisplay>('TickerDetailDisplay')
          .filtered(`ticker = '${ticker}' && section = '${section}'`)

        if (matchedTickerDisplays.length === 0) {
          realm.create<TickerDetailDisplay>(
            'TickerDetailDisplay',
            {
              _id: ObjectId(),
              ticker,
              section,
              subscribed: sectionNewState,
            },
            UpdateMode.Modified,
          )
        } else {
          matchedTickerDisplays[0].subscribed = sectionNewState
        }
      })

      setNotiSubscribed({
        ...notiSubscribed,
        [tickerDetailSectionsStrMap[section]]: sectionNewState,
      })
    } catch (err) {
      console.log('err ', err)
    }
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.tickerNotiSubscription}>
      <Header headerText={`${t('notiSubscribe')}`} withProfile={false} />

      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <View style={{ alignItems: 'center', paddingBottom: 10, flexDirection: 'row', flex: 1 }}>
          <View
            style={{
              paddingRight: 10,
              borderRadius: 4,
              backgroundColor: colors.darkBlueGray,
              paddingVertical: 4,
              paddingHorizontal: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.white,
                fontWeight: 'bold',
              }}
            >
              ${ticker}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.darkBlueGray,
                fontWeight: 'bold',
              }}
            >
              ({name})
            </Text>
          </View>
        </View>

        {map(notificationSections, (elem, idx) => {
          return (
            <View style={[SWITCH_SECTION_VIEW, {}]} key={`NotificationSectionsSwitch-${idx}`}>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: 18, color: colors.darkBlueGray, fontWeight: 'bold' }}>{t(elem.sectionString)}</Text>
              </View>

              <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
                <Switch value={notiSubscribed[elem.sectionString]} onValueChange={value => updateSectionDisplay(elem.section)} />
              </View>
            </View>
          )
        })}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default TickerNotiSubscriptionScreen
