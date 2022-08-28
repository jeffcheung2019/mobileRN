import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  TextStyle,
  Alert,
  ViewStyle,
  Image,
  Dimensions,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config, elevationStyle } from '@/Utils/constants'
import { RouteStacks } from '@/Navigators/routes'
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SearchScreenProps, SearchScreenNavigatorParamList } from '../SearchScreen'
import Header from '@/Components/Header'
import { getCompanyPage, getMetricsChart, getNewsItemPanel, getRatingsPanel, NewsItem, PriceTarget } from '@/Queries/SearchTab'
import moment from 'moment'
import LineStockChart from '@/Components/Graph/LineStockChart'
import { queryConstants } from '@/Queries/Constants'
import { map, times } from 'lodash'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { SharedElement } from 'react-navigation-shared-element'
import Animated, { FadeInDown, Keyframe, useAnimatedStyle, useSharedValue, ZoomIn } from 'react-native-reanimated'
import { useFinanceGraph } from '@/Hooks/useFinanceGraph'
import { GraphPoint } from '@/Types/Graph'
import { moneyConvertToKMB } from '@/Utils/helpers'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import PriceTargetSection from './Components/PriceTargetSection'
import InsiderTransactionSection from './Components/InsiderTransactionSection'
import EarningSection from './Components/EarningSection'
import { useRealm } from '@/Realms/RealmContext'
import SecFilingSection from './Components/SecFilingSection'
import NotiSubscribeButton from './Components/NotiSubscribeButton'

const windowWidth = Dimensions.get('window').width

type TickerDetailScreenProps = CompositeScreenProps<
  StackScreenProps<SearchScreenNavigatorParamList, RouteStacks.tickerDetail>,
  SearchScreenProps
>

const SECTION_VIEW: ViewStyle = {
  paddingHorizontal: 20,
  width: '100%',
  borderRadius: 20,
}

const SECTION_TITLE_TEXT: TextStyle = {
  color: colors.darkBlueGray,
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'left',
  paddingTop: 20,
  textDecorationLine: 'underline',
}

const TABLE_HEADER_TEXT: TextStyle = {
  color: colors.darkBlueGray,
  fontWeight: 'bold',
  fontSize: 12,
  textAlign: 'center',
  borderWidth: 1,
  borderColor: colors.brightGray,
  paddingVertical: 10,
  width: 80,
}

const SECTION_TITLE_VIEW: ViewStyle = {
  width: '100%',
  paddingHorizontal: 20,
  backgroundColor: colors.white,
  paddingVertical: 10,
}

const TickerDetailScreen: FC<TickerDetailScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const { id: companyId, ticker, name } = route?.params

  const companyPage = getCompanyPage(ticker)

  let { chartData, prevClose, currClose, lowest, highest } = useFinanceGraph(ticker)

  const priceTargets: PriceTarget[] | undefined = getRatingsPanel([companyId], 10)

  let priceChangePercent: number = ((currClose - prevClose) / prevClose) * 100

  return (
    <ScreenBackgrounds screenName={RouteStacks.tickerDetail}>
      <Header headerText={`${name}`} onLeftPress={() => navigation.navigate(RouteStacks.searchMain)} withProfile={false} />
      <KeyboardAwareScrollView
        style={[Layout.fill]}
        stickyHeaderIndices={[1, 3, 5, 7, 9]}
        contentContainerStyle={[Layout.colCenter, { flexGrow: 1, paddingTop: 20, justifyContent: 'flex-start' }]}
      >
        <View
          style={[
            SECTION_VIEW,
            {
              height: 300,
            },
          ]}
        >
          <View style={{ justifyContent: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <SharedElement id={`ticker.${ticker}`}>
                  <View
                    style={{
                      paddingHorizontal: 6,
                      width: 80,
                      paddingVertical: 6,
                      backgroundColor: colors.darkBlueGray,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: colors.white,
                      }}
                    >
                      ${ticker}
                    </Text>
                  </View>
                </SharedElement>
              </View>
              <Animated.View
                style={{
                  alignItems: 'flex-end',
                }}
                entering={ZoomIn.duration(1000)}
              >
                <NotiSubscribeButton
                  onPress={() =>
                    navigation.navigate(RouteStacks.tickerNotiSubscription, {
                      ticker,
                      name,
                    })
                  }
                />
              </Animated.View>
            </View>
            <Animated.View entering={FadeInDown.duration(500)}>
              <Text style={[{ color: colors.darkBlueGray, fontSize: 24, fontWeight: 'bold', textAlign: 'left' }]}>{`$${
                companyPage?.quote?.cents / 100
              }`}</Text>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.duration(500)}
              style={{
                flexDirection: 'row',
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: priceChangePercent > 0 ? colors.electricGreen : priceChangePercent === 0 ? colors.darkBlueGray : colors.crimson,
                }}
              >
                {priceChangePercent === 0 ? '-' : priceChangePercent > 0 ? '▲' : '▼'} {priceChangePercent?.toFixed(2)}%
              </Text>
            </Animated.View>
          </View>
          <View
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <LineStockChart
              chartData={chartData}
              width={windowWidth}
              height={250}
              priceChangePercent={priceChangePercent}
              lowest={lowest}
              highest={highest}
            />
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={SECTION_TITLE_VIEW}>
          <Text style={SECTION_TITLE_TEXT}>{t('priceTargets')}</Text>
        </Animated.View>

        <Animated.ScrollView entering={FadeInDown.delay(1000).duration(500)} style={[SECTION_VIEW, { maxHeight: 300 }]}>
          <PriceTargetSection priceTargets={priceTargets} />
        </Animated.ScrollView>

        <Animated.View entering={FadeInDown.delay(1500).duration(500)} style={SECTION_TITLE_VIEW}>
          <Text style={SECTION_TITLE_TEXT}>{t('earnings')}</Text>
        </Animated.View>

        <Animated.ScrollView entering={FadeInDown.delay(2000).duration(500)} style={[SECTION_VIEW, { maxHeight: 300 }]}>
          <EarningSection companyId={companyId} />
        </Animated.ScrollView>

        <Animated.View entering={FadeInDown.delay(2500).duration(500)} style={SECTION_TITLE_VIEW}>
          <Text style={SECTION_TITLE_TEXT}>{t('insiderTransactions')}</Text>
        </Animated.View>

        <Animated.ScrollView
          entering={FadeInDown.delay(3000).duration(500)}
          style={{ maxHeight: 300 }}
          contentContainerStyle={[SECTION_VIEW, {}]}
          showsVerticalScrollIndicator={false}
        >
          <InsiderTransactionSection companyId={companyId} />
        </Animated.ScrollView>

        <Animated.View entering={FadeInDown.delay(3500).duration(500)} style={SECTION_TITLE_VIEW}>
          <Text style={SECTION_TITLE_TEXT}>{t('secFilings')}</Text>
        </Animated.View>

        <Animated.ScrollView
          entering={FadeInDown.delay(4000).duration(500)}
          style={{ maxHeight: 300 }}
          contentContainerStyle={[SECTION_VIEW, {}]}
          showsVerticalScrollIndicator={false}
        >
          <SecFilingSection companyId={companyId} />
        </Animated.ScrollView>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default TickerDetailScreen
