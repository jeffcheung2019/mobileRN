import React, { FC, useEffect, useRef, useState } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, PressableProps, ViewStyle, TextStyle, Dimensions } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  measure,
  SharedValue,
  TransformStyleTypes,
  useAnimatedRef,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { getMetricsChart } from '@/Queries/SearchTab'
import { LineChart } from 'react-native-gifted-charts'
import times from 'lodash/times'
import { GraphPoint } from '@/Types/Graph'
import { VictoryArea, VictoryAxis, VictoryChart, VictoryTheme } from 'victory-native'

type InfoCardProps = {
  points: GraphPoint[]
  ticker: string
  tickerName: string
  containerStyle?: object
  animationType?: 'none' | 'horizontal'
  cardIdx?: number
  scrollPosition?: SharedValue<number>
  close: number
  prevClose: number
}

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const InfoCard = ({
  points,
  ticker,
  tickerName,
  cardIdx,
  close,
  prevClose,
  animationType,
  containerStyle,
  scrollPosition,
}: InfoCardProps) => {
  const { Layout, Images, Fonts } = useTheme()
  const aref: React.LegacyRef<Animated.View> = useAnimatedRef()
  const [companyId, setCompanyId] = useState<number>()

  const containerAnimatedStyle = useAnimatedStyle(() => {
    scrollPosition
    let animatedStyleRes: { transform?: TransformStyleTypes[]; opacity?: number } = {}
    const measuredVal = measure(aref)
    let transforms: TransformStyleTypes[] = []
    if (measuredVal.pageX < windowWidth && measuredVal.pageX >= (windowWidth * 9) / 10) {
      let interpolatedVal = (windowWidth - measuredVal.pageX) / (windowWidth / 10)
      transforms.push({ scale: withSpring(interpolatedVal) })
      animatedStyleRes.opacity = interpolatedVal
    } else if (measuredVal.pageX > windowWidth) {
      transforms.push({ scale: withSpring(0.85) })
      animatedStyleRes.opacity = 1
    } else if (measuredVal.pageX < (windowWidth * 9) / 10) {
      transforms.push({ scale: withSpring(1) })
      animatedStyleRes.opacity = 1
    }

    animatedStyleRes.transform = transforms

    return animatedStyleRes
  }, [scrollPosition])

  let priceChangePercent = (close / prevClose) * 100 - 100
  let closeDiff = close - prevClose
  let lowest = 9999999,
    highest = -9999999
  points.forEach((point: GraphPoint) => {
    if (point.value < lowest) {
      lowest = point.value
    }
    if (point.value > highest) {
      highest = point.value
    }
  })
  let diff = highest - lowest

  return (
    <Animated.View
      ref={aref}
      style={[
        {
          borderRadius: 10,
          width: 200,
          height: 130,
          borderWidth: 1,
          borderColor: colors.brightGray,
          padding: 14,
          ...containerStyle,
        },
        containerAnimatedStyle,
      ]}
    >
      <View
        style={{
          height: 50,
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            justifyContent: 'flex-start',
          }}
        >
          <Text
            style={[
              {
                width: '100%',
                color: colors.darkBlueGray,
                fontSize: 14,
                fontWeight: 'bold',
                height: 14,
              },
            ]}
          >
            {tickerName}
          </Text>
          <Text
            style={{
              fontSize: 10,
              paddingTop: 10,
              textAlign: 'left',
              color: priceChangePercent > 0 ? colors.electricGreen : priceChangePercent === 0 ? colors.darkBlueGray : colors.crimson,
            }}
          >
            {priceChangePercent === 0 ? '' : priceChangePercent > 0 ? '▲' : '▼'} {priceChangePercent?.toFixed(2)}%
          </Text>
        </View>
      </View>

      <View
        style={{
          width: 50,
          height: 70,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 150,
            height: '100%',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: -50,
              left: 0,
            }}
          >
            <VictoryChart theme={VictoryTheme.material} width={270} height={150}>
              <VictoryArea
                animate={{
                  duration: 2000,
                  onLoad: { duration: 1000 },
                }}
                style={{
                  data: {
                    fill: priceChangePercent > 0 ? colors.electricGreen : priceChangePercent === 0 ? colors.darkBlueGray : colors.crimson,
                    fillOpacity: 0.3,
                  },
                }}
                data={points}
                domain={{ y: [lowest, highest] }}
                x='date'
                y='value'
              />

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
      </View>
    </Animated.View>
  )
}

InfoCard.defaultProps = {}

export default InfoCard
