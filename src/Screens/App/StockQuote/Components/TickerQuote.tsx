import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import times from 'lodash/times'
import { Skeleton } from '@rneui/themed'
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from 'react-native-reanimated'
import { useFinanceGraph } from '@/Hooks/useFinanceGraph'
import LineStockChart from '@/Components/Graph/LineStockChart'

const windowWidth = Dimensions.get('window').width
type TickerQuoteProps = {
  ticker: string
}

const TickerQuote: FC<TickerQuoteProps> = ({ ticker }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  let { chartData, prevClose, currClose, lowest, highest } = useFinanceGraph(ticker)
  let priceChangePercent: number = ((currClose - prevClose) / prevClose) * 100

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      style={{
        flexDirection: 'column',
        height: 70,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginVertical: 6,
        padding: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: colors.darkBlueGray,
              paddingVertical: 4,
              marginVertical: 4,
              paddingHorizontal: 8,
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

        <View
          style={{
            paddingLeft: 4,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: priceChangePercent > 0 ? colors.electricGreen : priceChangePercent === 0 ? colors.darkBlueGray : colors.crimson,
            }}
          >
            {(currClose - prevClose).toFixed(2)}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: priceChangePercent > 0 ? colors.electricGreen : priceChangePercent === 0 ? colors.darkBlueGray : colors.crimson,
            }}
          >
            {priceChangePercent === 0 ? '-' : priceChangePercent > 0 ? '▲' : '▼'} {priceChangePercent?.toFixed(2)}%
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

export default TickerQuote
