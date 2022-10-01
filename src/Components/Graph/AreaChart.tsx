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
import { VictoryArea, VictoryAxis, VictoryChart, VictoryLabel, VictoryTheme, VictoryTooltip } from 'victory-native'

type AreaChartProps = {
  title?: string
  chartData: GraphPoint[]
  contentContainerStyle?: object
  lowest?: number
  highest?: number
  height: number
  hideYAxis?: boolean
  hideXAxis?: boolean
  width: number
}

const AreaChart: FC<AreaChartProps> = props => {
  const { title, chartData, contentContainerStyle, lowest, height, highest, width, hideYAxis, hideXAxis } = props

  const { Common, Fonts, Gutters, Layout } = useTheme()

  return chartData.length === 0 ? null : (
    <View
      style={{
        height,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: -15,
          width: '100%',
          height,
        }}
      >
        <VictoryChart theme={VictoryTheme.material} height={height} width={width} style={{}}>
          <VictoryArea
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            style={{
              data: {
                fill: colors.darkBlueGray,
                fillOpacity: 0.3,
                width: windowWidth,
              },
            }}
            data={chartData}
            domain={lowest !== undefined && highest !== undefined ? { y: [lowest, highest] } : undefined}
            x='date'
            y='value'
            // labelComponent={<VictoryTooltip active activateData data={chartData} />}
          />
          {/* <VictoryTooltip active activateData data={chartData} /> */}
          {hideYAxis ? null : (
            <VictoryAxis
              dependentAxis
              fixLabelOverlap
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
              ticks: { stroke: colors.darkBlueGray },
              tickLabels: { fill: colors.darkBlueGray },
              grid: { stroke: 'transparent' },
            }}
            tickFormat={tick => moment(tick).format('MM-YY')}
            tickLabelComponent={<VictoryLabel />}
          />
        </VictoryChart>
      </View>
    </View>
  )
}

export default AreaChart
