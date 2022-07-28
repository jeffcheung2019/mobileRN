import React, { FC, useMemo, useState } from 'react'
import { View, ViewStyle, TextStyle, Pressable, Text, Image, TextInput, ScrollView, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Spacing } from '@/Theme/Variables'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// @ts-ignore
import { LineChart, YAxis, XAxis, Grid } from 'react-native-svg-charts'
import { getMetricsChart, MetricsChartData } from '@/Queries/SearchTab'
import moment from 'moment'
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { LineChartBicolor } from 'react-native-gifted-charts'
import map from 'lodash/map'
import times from 'lodash/times'
// import { LineGraph } from 'react-native-graph'
// import { GraphPoint } from 'react-native-graph/lib/typescript/LineGraphProps'

const windowWidth = Dimensions.get('window').width

type LineStockChartProps = {
  title?: string
  chartData?: MetricsChartData
  contentContainerStyle?: object
}

const LineStockChart: FC<LineStockChartProps> = props => {
  const { title, chartData, contentContainerStyle } = props

  const animatedStyleVal = useSharedValue({
    x: 0,
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // transform: [
      //   {translateX: }
      // ]
    }
  }, [animatedStyleVal])

  const { Common, Fonts, Gutters, Layout } = useTheme()

  let rawYAxisData = chartData?.series[0].values ?? []
  let xAxisData = chartData?.xLabels ?? []

  let yAxisData = useMemo(() => {
    let lastNonNullIdx = 0,
      yAxisDataRes = []
    for (let i = 0; i < rawYAxisData.length; i++) {
      if (i === 0) {
        yAxisDataRes.push(rawYAxisData[i] === null ? rawYAxisData[i + 1] : rawYAxisData[i])
        continue
      }
      if (rawYAxisData[i] === null) {
        yAxisDataRes.push(rawYAxisData[lastNonNullIdx])
      } else {
        yAxisDataRes.push(rawYAxisData[i])
        lastNonNullIdx = i
      }
    }
    return yAxisDataRes
  }, [rawYAxisData])

  // console.log(
  //   '@@@ ',
  //   map(yAxisData, elem => {
  //     return {
  //       value: elem,
  //     }
  //   }),
  // )

  return (
    <LineChart
      areaChart
      isAnimated={true}
      animationDuration={1000}
      showXAxisIndices={false}
      showYAxisIndices={false}
      hideYAxisText={true}
      yAxisThickness={0}
      yAxisIndicesWidth={0}
      yAxisLabelWidth={0}
      yAxisOffset={0}
      disableScroll
      hideDataPoints
      hideOrigin
      initialSpacing={0}
      width={windowWidth + 60}
      height={200}
      yAxisTextNumberOfLines={0}
      thickness={0}
      style={{
        width: '100%',
        height: '100%',
      }}
      adjustToWidth
      startFillColor={colors.electricGreen}
      endFillColor={colors.green}
      data={
        times(10, e => {
          return {
            value: Math.random() * 4 + e,
          }
        }) as any
      }
    />
  )
}

export default LineStockChart
