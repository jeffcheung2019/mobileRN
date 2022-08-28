import React, { useState, useEffect, useCallback, FC, useRef, RefObject, ForwardedRef, MutableRefObject, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { EarningScreenNavigatorParamList, EarningScreenProps } from '@/Screens/App/EarningScreen'
import { RouteStacks } from '@/Navigators/routes'
import { CompositeScreenProps } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import Animated, { FadeInDown } from 'react-native-reanimated'
import EarningTableCard from '@/Components/Cards/EarningTableCard'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Calendar, CalendarList, Agenda, WeekCalendar } from 'react-native-calendars'
import { tradingViewEarningApi } from '@/Utils/apiUtils'
import map from 'lodash/map'
import reverse from 'lodash/reverse'
import sortBy from 'lodash/sortBy'
import FastImage, { Priority } from 'react-native-fast-image'
import { SvgUri } from 'react-native-svg'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import times from 'lodash/times'
import { Skeleton } from '@rneui/themed'
import EarningPlaceholder from './Components/EarningPlaceholder'
import { useCancelableSWR } from '@/Utils/swrUtils'
import axios, { Axios } from 'axios'
import useSWR from 'swr'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import { moneyConvertToKMB } from '@/Utils/helpers'
import BrightGrayInput from '@/Components/Inputs/BrightGrayInput'
import { filter, throttle } from 'lodash'

type EarningWeekDayContainerProps = {
  earningWeek: number
  earningDay: string
}

const EARNING_CONTENT_TEXT_STYLE: TextStyle = {
  fontSize: 14,
  color: colors.darkBlueGray,
}
const EARNING_CONTENT_SUB_TEXT_STYLE: TextStyle = {
  ...EARNING_CONTENT_TEXT_STYLE,
  fontSize: 10,
}

const windowWidth = Dimensions.get('window').width
const EarningWeekDayContainer: FC<EarningWeekDayContainerProps> = props => {
  const { earningDay, earningWeek } = props

  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [earningCompanies, setEarningCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [tickerQuery, setTickerQuery] = useState('')
  // const { data: swrData, error } = useCancelableSWR(tradingViewEarningApi(Number(earningDay)))

  useEffect(() => {
    const run = async () => {
      setIsLoading(true)
      let newEanringDay = Number(earningDay) + earningWeek * 7
      let tradingViewEarningApiRes = axios(tradingViewEarningApi(newEanringDay)).then(res => {
        let tradingViewEarningData = res?.data?.data ?? []
        let newEarningCompanies = []

        let startTimestamp = moment()
          .startOf('week')
          .add(12 * (1 + (newEanringDay + 1) * 2), 'hours')
          .unix()

        let endTimestamp = moment()
          .startOf('week')
          .add(12 * (2 + (newEanringDay + 1) * 2), 'hours')
          .unix()
        tradingViewEarningData.forEach((elem: any) => {
          newEarningCompanies.push({
            earningDate: [startTimestamp, endTimestamp],
            tickerIcon: elem[0],
            ticker: elem[1],
            marketCap: elem[2],
            tickerName: elem[12],
            epsEst: elem[3],
            epsReported: elem[4],
            revEst: moneyConvertToKMB(elem[7]),
            revReported: moneyConvertToKMB(elem[8]),
          })
        })

        setEarningCompanies(tradingViewEarningData)
        setIsLoading(false)
      })
    }
    run()
    // imgName === '' then symbol
    // https://s3-symbol-logo.tradingview.com/${imgName}.svg
    // imgName, ticker, market cap, eps estimate, 456,revenue forecast, 8,date, period ending, release time -1 = pre, 1 = post
  }, [earningDay, earningWeek])

  // console.log('earningCompanies', JSON.stringify(earningCompanies, null, 2))

  let filteredEarningCompanies = useMemo(
    throttle(() => {
      return filter(earningCompanies, (elem, idx) => {
        let metaDataArr = elem?.d ?? []
        // console.log('elem ', elem, metaDataArr)
        let tickerQueryLowercase = tickerQuery.toLowerCase()
        let tickerSymbol = metaDataArr[1] ?? ''
        let companyName = metaDataArr[12] ?? ''

        let tickerSymbolMatch = tickerSymbol.toLowerCase().includes(tickerQueryLowercase)
        let companyNameMatch = companyName.toLowerCase().includes(tickerQueryLowercase)

        return tickerQuery === '' || tickerSymbolMatch || companyNameMatch
      })
    }, 600),
    [earningCompanies, tickerQuery],
  )

  return isLoading ? (
    <EarningPlaceholder />
  ) : (
    <View style={{ flex: 1 }}>
      <View style={{ flexBasis: 50 }}>
        <BrightGrayInput
          value={tickerQuery}
          onChangeText={setTickerQuery}
          textInputProps={{
            placeholder: t('searchTicker'),
            autoCapitalize: 'characters',
          }}
          disableDefaultAnimation={true}
        />
      </View>
      <Animated.ScrollView style={Layout.fill} contentContainerStyle={[Gutters.smallHPadding, {}]}>
        {map(filteredEarningCompanies, (elem: { d: (string | number | null | undefined)[]; s: string }, idx: number) => {
          let metaDataArr = elem.d
          let ticker: string = metaDataArr[1] as string
          return (
            <Animated.View
              style={{
                flexDirection: 'row',
                height: 60,
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: colors.white,
                borderRadius: 10,
                marginVertical: 4,
                padding: 8,
              }}
              key={`EarningCompanies-${metaDataArr[1]}`}
            >
              <View style={{ flexBasis: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                {metaDataArr[0] === '' ? (
                  <View
                    style={{
                      backgroundColor: colors.darkBlueGray,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={[EARNING_CONTENT_TEXT_STYLE, { color: colors.white }]}>{ticker[0]}</Text>
                  </View>
                ) : (
                  <SvgUri
                    uri={`https://s3-symbol-logo.tradingview.com/${metaDataArr[0]}.svg`}
                    preserveAspectRatio='xMidYMid'
                    viewBox='0 0 18 18'
                    width={40}
                    height={40}
                  />
                )}
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                <View
                  style={{
                    justifyContent: 'flex-end',
                  }}
                >
                  <Text
                    style={[
                      EARNING_CONTENT_TEXT_STYLE,
                      {
                        fontWeight: 'bold',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {metaDataArr[1]}
                    {'   '}
                    <Text style={[EARNING_CONTENT_SUB_TEXT_STYLE]} numberOfLines={1}>
                      ({metaDataArr[12]})
                    </Text>
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    {
                      <Text style={[EARNING_CONTENT_SUB_TEXT_STYLE]}>
                        EPS Est.:
                        {![null, undefined, '', 0].includes(metaDataArr[3]) ? (
                          <Text
                            style={{
                              fontWeight: 'bold',
                            }}
                          >
                            {Number(metaDataArr[3]).toFixed(2)} USD
                          </Text>
                        ) : (
                          <Text>-</Text>
                        )}
                      </Text>
                    }
                    {
                      <Text style={[EARNING_CONTENT_SUB_TEXT_STYLE]}>
                        Act. EPS:
                        {![null, undefined, '', 0].includes(metaDataArr[4]) ? (
                          <Text
                            style={{
                              fontWeight: 'bold',
                            }}
                          >
                            {Number(metaDataArr[4]).toFixed(2)} USD
                          </Text>
                        ) : (
                          <Text>-</Text>
                        )}
                      </Text>
                    }
                  </View>
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    {
                      <Text style={[EARNING_CONTENT_SUB_TEXT_STYLE]}>
                        Rev Est.:
                        {![null, undefined, '', 0].includes(metaDataArr[7]) ? (
                          <Text
                            style={{
                              fontWeight: 'bold',
                            }}
                          >
                            {moneyConvertToKMB(Number(metaDataArr[7]))}
                          </Text>
                        ) : (
                          <Text>-</Text>
                        )}
                      </Text>
                    }

                    {
                      <Text style={[EARNING_CONTENT_SUB_TEXT_STYLE]}>
                        Act. Rev:
                        {![null, undefined, '', 0].includes(metaDataArr[8]) ? (
                          <Text
                            style={{
                              fontWeight: 'bold',
                            }}
                          >
                            {moneyConvertToKMB(Number(metaDataArr[8]))}
                          </Text>
                        ) : (
                          <Text>-</Text>
                        )}
                      </Text>
                    }
                  </View>
                </View>
              </View>

              <View style={{ flexBasis: 40, justifyContent: 'center', alignItems: 'center' }}>
                {metaDataArr[11] === -1 ? (
                  <MaterialCommunityIcons name={'white-balance-sunny'} size={config.iconSize} color={colors.darkBlueGray} />
                ) : (
                  <Ionicons name='moon' size={config.iconSize} color={colors.darkBlueGray} />
                )}
              </View>
            </Animated.View>
          )
        })}
      </Animated.ScrollView>
    </View>
  )
}

export default React.memo(EarningWeekDayContainer)
