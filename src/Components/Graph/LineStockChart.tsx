import React, { FC, useEffect, useMemo, useState } from 'react'
import { View, ViewStyle, TextStyle, Pressable, Text, Image, TextInput, ScrollView, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Spacing } from '@/Theme/Variables'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// @ts-ignore
import { getMetricsChart } from '@/Queries/SearchTab'
import moment from 'moment'
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { LineChartBicolor } from 'react-native-gifted-charts'
import map from 'lodash/map'
import times from 'lodash/times'
import { GraphPoint } from '@/Types/Graph'
const windowWidth = Dimensions.get('window').width
import { VictoryArea, VictoryAxis, VictoryChart, VictoryTheme } from 'victory-native'

type LineStockChartProps = {
  title?: string
  chartData: GraphPoint[]
  priceChangePercent: number
  contentContainerStyle?: object
  lowest?: number
  highest?: number
  height: number
  hideYAxis?: boolean
  width: number
}

const LineStockChart: FC<LineStockChartProps> = props => {
  const { title, chartData, contentContainerStyle, priceChangePercent, lowest, height, highest, width, hideYAxis } = props

  const { Common, Fonts, Gutters, Layout } = useTheme()

  return chartData.length === 0 ? null : (
    <View
      style={{
        height: 180,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: -30,
          left: -15,
          width: '100%',
          height,
        }}
      >
        <VictoryChart theme={VictoryTheme.material} height={height} width={width + 10} style={{}}>
          <VictoryArea
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            style={{
              data: {
                fill: priceChangePercent > 0 ? colors.electricGreen : priceChangePercent === 0 ? colors.darkBlueGray : colors.crimson,
                fillOpacity: 0.3,
                height: 200,
                width: windowWidth,
              },
            }}
            data={chartData}
            domain={lowest !== undefined && highest !== undefined ? { y: [lowest, highest] } : undefined}
            x='date'
            y='value'
          />
          {hideYAxis ? null : (
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: 'transparent' },
                grid: { stroke: 'transparent' },
                ticks: { stroke: 'transparent' },
                tickLabels: { fill: colors.darkBlueGray },
              }}
            />
          )}
          <VictoryAxis
            style={{
              axis: { stroke: 'transparent' },
              ticks: { stroke: 'transparent' },
              tickLabels: { fill: 'transparent' },
              grid: { stroke: 'transparent' },
            }}
          />
        </VictoryChart>
      </View>
    </View>
  )
}

export default LineStockChart
