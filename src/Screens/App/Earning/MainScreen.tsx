import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
  TextStyle,
  Alert,
  ViewStyle,
  useWindowDimensions,
  Pressable,
  Dimensions,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
import { createStackNavigator } from '@react-navigation/stack'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { MainTabNavigatorParamList, MainTabNavigatorProps } from '@/Navigators/MainStackNavigator'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { Route, TabBar, TabView } from 'react-native-tab-view'
import EarningWeekDayContainer from './EarningWeekDayContainer'
import { Skeleton } from '@rneui/themed'
import { map, times } from 'lodash'
import { CancelableSWRResult, useCancelableSWR } from '@/Utils/swrUtils'
import { tradingViewEarningApi } from '@/Utils/apiUtils'
import useSWR, { SWRConfiguration } from 'swr'
import axios from 'axios'
import useSWRImmutable from 'swr/immutable'
import Header from '@/Components/Header'
const Stack = createStackNavigator()
const windowWidth = Dimensions.get('window').width

export type EarningMainScreenNavigatorParamList = {
  [RouteStacks.earningMain]: undefined
}

export type EarningMainScreenNavigationProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabNavigatorParamList, RouteTabs.earning>,
  MainTabNavigatorProps
>

type SceneRoute = {
  route: {
    key: string
  }
}

const weekDayStr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const weekStr = ['This week', 'Next week']

const EarningMainScreen: FC<EarningMainScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [weekIdx, setWeekIdx] = useState(0) // 0 this week, 1 next week
  const [screenIdx, setScreenIdx] = useState(0)
  const layout = useWindowDimensions()
  const [screens] = useState([{ key: '0' }, { key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }])

  const renderScene = ({ route }: { route: Route }) => {
    return <EarningWeekDayContainer earningWeek={weekIdx} earningDay={route.key} />
  }

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
      <Header headerText={t('earningCalendar')} />

      <View style={{ flexBasis: 44, paddingHorizontal: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            height: 44,
            alignItems: 'center',
          }}
        >
          {map(weekStr, (week, idx) => {
            return (
              <Pressable
                style={{
                  width: 120,
                  height: 40,
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                }}
                key={`EarningWeekTabBar-${idx}`}
              >
                <Pressable
                  onPress={() => {
                    setWeekIdx(idx)
                  }}
                  style={{
                    borderRadius: 20,
                    height: 30,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: colors.darkBlueGray,
                    backgroundColor: weekIdx === idx ? colors.darkBlueGray : colors.transparent,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: 'center',
                      color: weekIdx === idx ? colors.white : colors.darkBlueGray,
                    }}
                  >
                    {weekStr[idx]}
                  </Text>
                </Pressable>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>
      <View style={{ flexBasis: 44, paddingHorizontal: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ height: 44, alignItems: 'center' }}>
          {map(weekDayStr, (weekDay, idx) => {
            return (
              <Pressable
                style={{
                  width: 70,
                  height: 40,
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                }}
                key={`EarningDayTabBar-${idx}`}
              >
                <Pressable
                  onPress={() => {
                    setScreenIdx(idx)
                  }}
                  style={{
                    borderRadius: 20,
                    height: 30,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: colors.darkBlueGray,
                    backgroundColor: screenIdx === idx ? colors.darkBlueGray : colors.transparent,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: 'center',
                      color: screenIdx === idx ? colors.white : colors.darkBlueGray,
                    }}
                  >
                    {weekDayStr[idx]}
                  </Text>
                </Pressable>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      <TabView
        style={{
          width: '100%',
          flex: 3,
        }}
        lazy
        lazyPreloadDistance={0}
        renderTabBar={() => null}
        navigationState={{ index: screenIdx, routes: screens }}
        renderScene={renderScene}
        onIndexChange={setScreenIdx}
        sceneContainerStyle={{}}
        initialLayout={{ width: layout.width }}
      />
    </View>
  )
}

export default EarningMainScreen
