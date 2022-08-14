import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Image } from 'react-native'
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
import { SearchScreenNavigationProps, SearchScreenNavigatorParamList } from '../SearchScreen'
import Header from '@/Components/Header'
import { getCompanyPage, getMetricsChart, getNewsItemPanel, getRatingsPanel, NewsItem, PriceTarget } from '@/Queries/SearchTab'
import moment from 'moment'
import LineStockChart from '@/Components/Graph/LineStockChart'
import { queryConstants } from '@/Queries/Constants'
import { map, times } from 'lodash'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { SharedElement } from 'react-navigation-shared-element'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useFinanceGraph } from '@/Hooks/useFinanceGraph'
import { GraphPoint } from '@/Types/Graph'
import { moneyConvertToKMB } from '@/Utils/helpers'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

type TickerDetailScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<SearchScreenNavigatorParamList, RouteStacks.tickerDetail>,
  SearchScreenNavigationProps
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

const INSIDER_TRANSACTION_CELL_TEXT: TextStyle = {
  color: colors.darkBlueGray,
  textAlign: 'left',
  fontSize: 10,
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

type InsiderTransaction = NewsItem & {
  action: string
  unitsSold: RegExpMatchArray | null
  unitsBought: RegExpMatchArray | null
  unitsWorth: string
  unitsOptionsCoverted: RegExpMatchArray | null
}

type EarningResult = {
  earningDate: string
  quarterYearDate: string
  pmAm: string
}

let quarterNumMap: { [key: string]: number } = {
  First: 1,
  Second: 2,
  Third: 3,
  Fourth: 4,
}

const TickerDetailScreen: FC<TickerDetailScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const { id: companyId, ticker, name } = route?.params
  const [isSubscribed, setIsSubscribed] = useState(false)

  const companyPage = getCompanyPage(ticker)

  let { chartData, prevClose, currClose, lowest, highest } = useFinanceGraph(ticker)

  const rawEarningResult: NewsItem[] | undefined = getNewsItemPanel(
    [companyId],
    queryConstants.getNewsItemPanel.earningResult.sourceIds,
    queryConstants.getNewsItemPanel.earningResult.categoryIds,
    20,
  )

  const earningResult: EarningResult[] = useMemo(() => {
    let res: EarningResult[] = []
    if (rawEarningResult) {
      for (let i = rawEarningResult.length - 1; i >= 0; i--) {
        let elem = rawEarningResult[i]
        let elemTitle = elem?.title
        let elemSummary = elem?.summary
        let isEarningDateAnnouncement = elemTitle?.match(/to Report/g)
        let isPerliminaryRes = elemTitle?.match(/Preliminary Unaudited/g)
        let eanringYear = elemTitle?.match(/[0-9]+ (?=Earnings on)/g)
        let earningDate = elemTitle?.match(/[a-zA-Z]+ [0-9]+, [0-9]+/g)
        let earningQuarter = elemTitle?.match(/First|Second|Third|Fourth/g)
        let earningReleaseMarketTime = elemSummary?.match(/before|after the market open|close/g)
        let earnignPTET = elemSummary?.match(/[0-9]+:[0-9]+ a.m.|p.m. PT \/ [0-9]+:[0-9]+ a.m|p.m. ET/g)

        if (isPerliminaryRes && earningReleaseMarketTime) {
          let pmAm = earningReleaseMarketTime[0] === 'before the market open' ? 'PM' : 'AM'
          let quarter = elemTitle?.match(/Q[0-4]/g)
          eanringYear = elemTitle?.match(/[0-4]+ (?=Financial Results)/g)
          earningDate = elemSummary?.match(/[a-zA-Z]+ [0-9]+, [0-9]+/g)

          if (quarter && earningDate && eanringYear) {
            res.push({
              earningDate: `${earningDate[0]}`,
              pmAm,
              quarterYearDate: `${quarter[0]} 20${eanringYear[0]}`,
            })
          }
        } else if (isEarningDateAnnouncement && eanringYear && earningDate && earningReleaseMarketTime) {
          let pmAm = earningReleaseMarketTime[0] === 'before the market open' ? 'PM' : 'AM'
          if (earningQuarter && ['First', 'Second', 'Third', 'Fourth'].includes(earningQuarter[0])) {
            res.push({
              earningDate: `${earningDate[0]}`,
              pmAm,
              quarterYearDate: `Q${quarterNumMap[earningQuarter[0]]} ${eanringYear[0]}`,
            })
          }
        }
      }
    }
    return res
  }, [rawEarningResult])

  const rawInsiderTransactions: NewsItem[] | undefined = getNewsItemPanel(
    [companyId],
    queryConstants.getNewsItemPanel.insiderTransactions.sourceIds,
    queryConstants.getNewsItemPanel.insiderTransactions.categoryIds,
    40,
  )

  const insiderTransactions: InsiderTransaction[] | [] = useMemo(() => {
    let res: InsiderTransaction[] | undefined = []
    if (rawInsiderTransactions === undefined) return res
    for (let i = 0; i < rawInsiderTransactions.length; i++) {
      let title = rawInsiderTransactions[i]?.title
      let isBuy = title?.match(/bought [$0-9,.]+ worth of shares/g)
      let isSell = title?.match(/sold [$0-9,.]+ worth of shares/g)
      let shareUnits = title?.match(/[0-9.,]+(?= units at)/g)
      let unitsWorth = title?.match(/[0-9,]+(?= worth of shares)/g) ?? []
      let isOptionExercised = title?.match(/exercised/g)
      let unitsOptionsCoverted = title?.match(/[0-9,]+ (?=shares)/g)

      let action: string = ''
      if (isSell) {
        action = 'Sale'
      } else if (isBuy) {
        action = 'Buy'
      } else if (isOptionExercised) {
        action = 'Option'
      } else {
        action = ''
      }
      if (['Sale', 'Buy', 'Option'].includes(action)) {
        res.push({
          ...rawInsiderTransactions[i],
          action,
          unitsSold: isSell ? shareUnits : null,
          unitsBought: isBuy ? shareUnits : null,
          unitsWorth: unitsWorth[0] ?? '0',
          unitsOptionsCoverted,
        })
      }
    }

    return res
  }, [rawInsiderTransactions])

  const priceTargets: PriceTarget[] | undefined = getRatingsPanel([companyId], 10)

  const secFilings: NewsItem[] | undefined = getNewsItemPanel(
    [companyId],
    queryConstants.getNewsItemPanel.secFiling.sourceIds,
    queryConstants.getNewsItemPanel.secFiling.categoryIds,
    5,
  )

  let priceChangePercent: number = ((currClose - prevClose) / prevClose) * 100
  return (
    <ScreenBackgrounds screenName={RouteStacks.eventMain}>
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
                  flexBasis: 100,
                }}
              >
                <SharedElement id={`ticker.${ticker}`}>
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: 'bold',
                      paddingHorizontal: 6,
                      width: 80,
                      paddingVertical: 6,
                      backgroundColor: colors.darkBlueGray,
                      color: colors.white,
                    }}
                  >
                    ${ticker}
                  </Text>
                </SharedElement>
              </View>
              <Pressable
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  paddingHorizontal: 10,
                }}
                onPress={() => setIsSubscribed(!isSubscribed)}
              >
                <Animated.View>
                  <MaterialIcons
                    name={isSubscribed ? 'notifications' : 'notifications-none'}
                    size={config.iconSize}
                    color={colors.darkBlueGray}
                  />
                </Animated.View>
              </Pressable>
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
            <LineStockChart chartData={chartData} height={250} priceChangePercent={priceChangePercent} lowest={lowest} highest={highest} />
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={SECTION_TITLE_VIEW}>
          <Text style={SECTION_TITLE_TEXT}>{t('priceTarget')}</Text>
        </Animated.View>

        <Animated.ScrollView entering={FadeInDown.delay(1000).duration(500)} style={[SECTION_VIEW, { maxHeight: 300 }]}>
          {map(priceTargets, (priceTarget: PriceTarget, idx: number) => {
            let ptPrior = priceTarget.ptPrior ? priceTarget.ptPrior / 100 : null
            let pt = priceTarget.pt ? priceTarget.pt / 100 : null
            let { rating, date, analyst, ratingPrior } = priceTarget
            return (
              <Pressable
                key={`PriceTarget-${idx}`}
                style={{
                  height: 50,
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  // InAppBrowser.open(pt.link)
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                  }}
                >
                  <View style={{ flex: 4, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>{t('date')}:</Text>
                      {`  ${moment(date).format('DD-MM-YYYY')}`}
                    </Text>
                    <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>{t('analyst')}:</Text> {` ${analyst}`}
                    </Text>
                    <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>{t('priceTargetChange')}:</Text> {ptPrior !== null ? `$${ptPrior}` : ''}{' '}
                      {ptPrior ? '->' : ''} {`$${pt}`}
                    </Text>
                  </View>
                  <View style={{ flex: 4, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ backgroundColor: colors.darkBlueGray, paddingVertical: 4, paddingHorizontal: 6 }}>
                        <Text style={{ fontWeight: 'bold', color: colors.white, fontSize: 9 }}>{ratingPrior}</Text>
                      </View>
                      <View style={{ justifyContent: 'center', paddingHorizontal: 8 }}>
                        {ratingPrior && <Text style={{ color: colors.darkBlueGray, fontSize: 9 }}>{'->'}</Text>}
                      </View>
                      <View style={{ backgroundColor: colors.darkBlueGray, paddingVertical: 4, paddingHorizontal: 6 }}>
                        <Text style={{ fontWeight: 'bold', color: colors.white, fontSize: 9 }}>{rating}</Text>
                      </View>
                    </View>
                  </View>
                  {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    
                  </View> */}
                </View>
              </Pressable>
            )
          })}
        </Animated.ScrollView>

        <Animated.View entering={FadeInDown.delay(1500).duration(500)} style={SECTION_TITLE_VIEW}>
          <Text style={SECTION_TITLE_TEXT}>{t('earning')}</Text>
        </Animated.View>

        <Animated.ScrollView
          entering={FadeInDown.delay(2000).duration(500)}
          stickyHeaderIndices={[0]}
          style={[SECTION_VIEW, { maxHeight: 300 }]}
        >
          <View style={{ backgroundColor: colors.white, width: '100%' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[TABLE_HEADER_TEXT, { width: 120 }]}>{t('earningQuarter')}</Text>

              <Text
                style={[
                  TABLE_HEADER_TEXT,
                  {
                    flex: 1,
                  },
                ]}
              >
                {t('date')}
              </Text>
            </View>
          </View>
          {map(earningResult, (earning, idx) => {
            return (
              <View
                key={`EarningResult-${idx}`}
                style={{
                  height: 50,
                  width: '100%',
                  // borderColor: colors.brightGray,
                  // borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  // backgroundColor: idx % 2 === 0 ? colors.white : colors.brightGray,
                }}
              >
                <View style={{ width: 120 }}>
                  <Text style={{ color: colors.darkBlueGray, fontSize: 10, textAlign: 'center' }}>{earning.quarterYearDate}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: colors.darkBlueGray, fontSize: 10, marginHorizontal: 20 }}>
                    {moment(earning.earningDate, 'MMMM DD, YYYY').format('DD-MM-YYYY')}
                  </Text>
                  <Text
                    style={{
                      color: colors.white,
                      backgroundColor: colors.darkBlueGray,
                      width: 36,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}
                  >
                    {earning.pmAm}
                  </Text>
                </View>
              </View>
            )
          })}
        </Animated.ScrollView>

        <View style={SECTION_TITLE_VIEW}>
          <Text style={SECTION_TITLE_TEXT}>{t('insiderTransactions')}</Text>
        </View>

        <ScrollView
          style={{ maxHeight: 300 }}
          contentContainerStyle={[SECTION_VIEW, {}]}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ backgroundColor: colors.white, width: '100%' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[TABLE_HEADER_TEXT]}>{t('date')}</Text>
              <Text style={[TABLE_HEADER_TEXT]}>{t('transaction')}</Text>
              <Text style={[TABLE_HEADER_TEXT]}>{t('shares')}</Text>
              <Text style={[TABLE_HEADER_TEXT]}>{t('value')}($)</Text>
            </View>
          </View>
          {map(insiderTransactions, (transaction, idx: number) => {
            const { unitsSold, unitsBought, unitsOptionsCoverted, unitsWorth, action, publishedAt, link } = transaction

            return action === '' ? null : (
              <Pressable
                style={{
                  height: 50,
                  width: '100%',
                  // borderColor: colors.brightGray,
                  // borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  // backgroundColor: idx % 2 === 0 ? colors.white : colors.brightGray,
                }}
                key={`InsiderTransaction-${idx}`}
                onPress={() => InAppBrowser.open(link)}
              >
                {
                  <>
                    <View style={{ width: 80, alignItems: 'center' }}>
                      <Text style={[INSIDER_TRANSACTION_CELL_TEXT]}>{moment(publishedAt).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View style={{ width: 80, alignItems: 'center' }}>
                      <Text
                        style={{
                          width: '80%',
                          textAlign: 'center',
                          backgroundColor: colors.darkBlueGray,
                          color: colors.white,
                          fontWeight: 'bold',
                          fontSize: 10,
                          paddingVertical: 4,
                        }}
                      >
                        {action}
                      </Text>
                    </View>
                    <View style={{ width: 80, alignItems: 'center' }}>
                      <Text style={[INSIDER_TRANSACTION_CELL_TEXT, {}]}>
                        {action === 'Sale' ? unitsSold : action === 'Buy' ? unitsBought : action === 'Option' ? unitsOptionsCoverted : ''}
                      </Text>
                    </View>
                    <View style={{ width: 80, alignItems: 'center' }}>
                      <Text style={[INSIDER_TRANSACTION_CELL_TEXT]}>{moneyConvertToKMB(Number(unitsWorth.replace(/,/g, '')))}</Text>
                    </View>
                  </>
                }
              </Pressable>
            )
          })}
        </ScrollView>

        <View style={SECTION_TITLE_VIEW}>
          <Text style={SECTION_TITLE_TEXT}>{t('secFilings')}</Text>
        </View>

        <ScrollView style={{ maxHeight: 300 }} contentContainerStyle={[SECTION_VIEW, {}]} showsVerticalScrollIndicator={false}>
          {map(secFilings, (sec, idx: number) => {
            return (
              <Pressable
                style={{
                  height: 60,
                  // paddingHorizontal: 10,
                  width: '100%',
                  // borderColor: colors.brightGray,
                  // borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  // backgroundColor: idx % 2 === 0 ? colors.white : colors.brightGray,
                }}
                key={`SecFiling-${idx}`}
                onPress={() => InAppBrowser.open(sec.link)}
              >
                {
                  <View style={{ flexDirection: 'row' }}>
                    {/* <View style={{ flex: 1 }}>
                      <Image source={{ uri: config.defaultSECImg }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    </View> */}
                    <View style={{ flex: 4, justifyContent: 'center' }}>
                      <View style={{}}>
                        <Text numberOfLines={1} style={{ color: colors.darkBlueGray, fontSize: 12, fontWeight: 'bold' }}>
                          {sec.title}
                        </Text>
                      </View>
                      <View style={{}}>
                        <Text numberOfLines={2} style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                          {sec.summary}
                        </Text>
                      </View>
                    </View>
                  </View>
                }
              </Pressable>
            )
          })}
        </ScrollView>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default TickerDetailScreen
