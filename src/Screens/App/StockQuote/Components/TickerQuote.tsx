import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import times from 'lodash/times'
import { Skeleton } from '@rneui/themed'
import Animated, { FadeInDown, FadeInRight, FadeOutLeft, FadeOutUp } from 'react-native-reanimated'
import { useFinanceGraph } from '@/Hooks/useFinanceGraph'
import { useRealm } from '@/Realms/RealmContext'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import { StockQuoteScreenNavigationProp } from '../../StockQuoteScreen'
import { StockQuoteMainScreenNavigationProp } from '../MainScreen'

const windowWidth = Dimensions.get('window').width
type TickerQuoteProps = {
  id: number
  ticker: string
  navigation: StockQuoteMainScreenNavigationProp
}

const TickerQuote: FC<TickerQuoteProps> = ({ id, ticker, navigation }) => {
  const realm = useRealm()
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  let { chartData, prevClose, currClose, lowest, highest } = useFinanceGraph(ticker)
  let priceChangePercent: number = ((currClose - prevClose) / prevClose) * 100

  let tickerQuoteBgColor = useMemo(() => {
    if (priceChangePercent === 0) {
      return colors.whiteDarkBlueGray25
    } else if (priceChangePercent > 0 && priceChangePercent <= 5) {
      return colors.whiteElectricGreen25
    } else if (priceChangePercent > 5 && priceChangePercent <= 10) {
      return colors.whiteElectricGreen50
    } else if (priceChangePercent > 10 && priceChangePercent <= 15) {
      return colors.whiteElectricGreen75
    } else if (priceChangePercent > 15 && priceChangePercent <= 20) {
      return colors.electricGreen
    } else if (priceChangePercent < 0 && priceChangePercent >= -5) {
      return colors.whiteCrimson25
    } else if (priceChangePercent < -5 && priceChangePercent >= -10) {
      return colors.whiteCrimson50
    } else if (priceChangePercent < -10 && priceChangePercent >= -15) {
      return colors.whiteCrimson75
    } else if (priceChangePercent < -15 && priceChangePercent >= -20) {
      return colors.crimson
    }
  }, [priceChangePercent])

  const onPressTickerQuote = ({ id, ticker }: { id: number; ticker: string }) => {
    navigation.navigate(RouteTabs.search, {
      screen: RouteStacks.tickerDetail,
      params: {
        id: id,
        ticker: ticker,
        prevScreen: {
          tab: RouteTabs.stockQuote,
          stack: RouteStacks.stockQuoteMain,
        },
      },
    })
  }

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      style={{
        flexDirection: 'column',
        height: 70,
        width: '47%',
        backgroundColor: tickerQuoteBgColor,
        borderColor: colors.transparent,
        borderWidth: 1,
        margin: 2,
        paddingVertical: 4,
        paddingHorizontal: 8,
      }}
    >
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
        }}
        onPress={() => onPressTickerQuote({ id, ticker })}
      >
        <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
          <View
            style={{
              backgroundColor: colors.darkBlueGray,
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 4,
              marginVertical: 4,
            }}
          >
            <Text
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

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <View style={{}}>
              <Text
                style={{
                  color: colors.darkBlueGray,
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                ${currClose}
              </Text>
            </View>
            <View style={{ justifyContent: 'flex-end', paddingLeft: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.darkBlueGray,
                  fontWeight: 'bold',
                }}
              >
                {priceChangePercent === 0 ? '-' : priceChangePercent > 0 ? '▲' : '▼'} {priceChangePercent?.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  )
}

export default TickerQuote
