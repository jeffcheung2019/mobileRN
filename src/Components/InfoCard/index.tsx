import React, { FC, useRef } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, PressableProps, ViewStyle, TextStyle, Dimensions } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { measure, SharedValue, TransformStyleTypes, useAnimatedRef, useAnimatedStyle } from 'react-native-reanimated'

import { LineChart, Grid } from 'react-native-svg-charts'

type InfoCardProps = {
  ticker: string
  companyName: string
  containerStyle?: object
  animationType?: 'none' | 'horizontal'
  cardIdx?: number
  scrollPosition?: SharedValue<number>
}

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const InfoCard = ({ ticker, companyName, cardIdx, animationType, containerStyle, scrollPosition }: InfoCardProps) => {
  const { Layout, Images, Fonts } = useTheme()
  const aref: React.LegacyRef<Animated.View> = useAnimatedRef()

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

  return (
    <Animated.View
      ref={aref}
      style={[
        {
          borderRadius: 20,
          borderWidth: 1,
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
                color: colors.darkCharcoal,
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
                color: colors.spanishGray,
              },
              Fonts.textXS,
            ]}
          >
            {companyName}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Text
            style={{
              color: colors.crimson,
            }}
          >
            - 10%
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
          <Text style={[Fonts.textXS, Layout.fullWidth, { color: colors.spanishGray, textAlign: 'left' }]}>H: $42</Text>
          <Text style={[Fonts.textXS, Layout.fullWidth, { color: colors.spanishGray, textAlign: 'left' }]}>L: $40.2</Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <LineChart
            style={{ width: '100%', height: '100%' }}
            data={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]}
            svg={{ stroke: colors.crimson }}
            contentInset={{ top: 20, bottom: 20 }}
            animate
          ></LineChart>
        </View>
      </View>
    </Animated.View>
  )
}

InfoCard.defaultProps = {}

export default InfoCard
