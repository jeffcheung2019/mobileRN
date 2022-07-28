import React, { FC, useEffect, useRef, useState } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, PressableProps, ViewStyle, TextStyle, Dimensions } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { measure, SharedValue, TransformStyleTypes, useAnimatedRef, useAnimatedStyle } from 'react-native-reanimated'
import { getMetricsChart } from '@/Queries/SearchTab'

// import { LineGraph } from 'react-native-graph'
// import { GraphPoint } from 'react-native-graph/lib/typescript/LineGraphProps'

type InfoCardProps = {
  // points: GraphPoint
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
  // points,
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
      transforms.push({ scale: interpolatedVal })
      animatedStyleRes.opacity = interpolatedVal
    } else if (measuredVal.pageX > windowWidth) {
      transforms.push({ scale: 0.85 })
      animatedStyleRes.opacity = 1
    } else if (measuredVal.pageX < (windowWidth * 9) / 10) {
      transforms.push({ scale: 1 })
      animatedStyleRes.opacity = 1
    }

    animatedStyleRes.transform = transforms

    return animatedStyleRes
  }, [scrollPosition])

  let priceChangePercent = (close / prevClose) * 100 - 100
  let closeDiff = close - prevClose

  return (
    <Animated.View
      ref={aref}
      style={[
        {
          borderRadius: 10,
          borderWidth: 0,
          minWidth: 200,
          backgroundColor: colors.white,
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderColor: colors.brightGray,
          ...containerStyle,
        },
        containerAnimatedStyle,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Text
            style={[
              {
                width: '100%',
                color: colors.darkBlueGray,
                textAlign: 'left',
              },
              Fonts.textSM,
            ]}
          >
            {ticker}
          </Text>
          <Text
            style={[
              {
                width: '100%',
                color: colors.darkBlueGray,
                fontSize: 14,
                fontWeight: 'bold',
              },
            ]}
          >
            {tickerName}
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}
        >
          <Text style={[Layout.fullWidth, { fontSize: 12, fontWeight: 'bold', color: colors.darkBlueGray, textAlign: 'left' }]}>
            {close}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'left',
              color: priceChangePercent > 0 ? colors.lawnGreen : priceChangePercent === 0 ? colors.darkBlueGray : colors.crimson,
            }}
          >
            {priceChangePercent === 0 ? '' : priceChangePercent > 0 ? '▲' : '▼'} {priceChangePercent?.toFixed(2)}%
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'left',
              color: closeDiff > 0 ? colors.lawnGreen : closeDiff === 0 ? colors.darkBlueGray : colors.crimson,
            }}
          >
            {closeDiff === 0 ? '' : closeDiff > 0 ? '+' : '-'} {Math.abs(closeDiff)?.toFixed(2)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          {/* <LineGraph points={points} style={{ width: '100%', height: '100%' }} color={colors.darkBlueGray} animated /> */}
        </View>
      </View>
    </Animated.View>
  )
}

InfoCard.defaultProps = {}

export default InfoCard
