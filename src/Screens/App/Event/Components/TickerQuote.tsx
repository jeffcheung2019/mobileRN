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
        height: 90,
        width: '100%',
        flexDirection: 'column',
        backgroundColor: colors.white,
        borderRadius: 10,
        marginVertical: 6,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            flexBasis: 100,
            justifyContent: 'center',
            paddingLeft: 10,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              paddingVertical: 4,
              backgroundColor: colors.darkBlueGray,
              color: colors.white,
              marginVertical: 4,
            }}
          >
            ${ticker}
          </Text>

          <Text
            style={{
              color: colors.darkBlueGray,
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            ${currClose}
          </Text>

          <Text
            style={{
              fontSize: 10,
              color: priceChangePercent > 0 ? colors.electricGreen : priceChangePercent === 0 ? colors.darkBlueGray : colors.crimson,
            }}
          >
            {priceChangePercent === 0 ? '-' : priceChangePercent > 0 ? '▲' : '▼'} {priceChangePercent?.toFixed(2)}%
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            height: '100%',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: -50,
              left: -20,
            }}
          >
            <LineStockChart
              chartData={chartData}
              height={170}
              width={windowWidth - 45}
              priceChangePercent={priceChangePercent}
              lowest={lowest}
              hideYAxis
              highest={highest}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

export default TickerQuote
