import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import times from 'lodash/times'
import { Skeleton } from '@rneui/themed'
import Animated, { FadeInDown } from 'react-native-reanimated'

type EarningPlaceholderProps = {}
const EARNING_REV_EPS_SKELETON: ViewStyle = {
  marginVertical: 4,
}

const EarningPlaceholder: FC<EarningPlaceholderProps> = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <ScrollView style={{ flex: 1 }} stickyHeaderIndices={[0]}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: colors.white,
        }}
      >
        <View
          style={{
            height: 50,
            borderRadius: 10,
            backgroundColor: colors.brightGray,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 12, color: colors.darkBlueGray }}>{t('loading')}...</Text>
        </View>
      </View>

      {times(10).map((e, idx) => {
        return (
          <Animated.View
            entering={FadeInDown.duration(1000)}
            style={{
              flexDirection: 'row',
              height: 60,
              alignItems: 'center',
              padding: 8,
              backgroundColor: colors.white,
              borderRadius: 10,
              margin: 4,
            }}
            key={`EarningPlaceholder-${idx}`}
          >
            <View
              style={{
                flexBasis: 60,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Skeleton animation='pulse' width={40} height={40} />
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  flexBasis: 12,
                  paddingHorizontal: 4,
                  justifyContent: 'center',
                  width: '80%',
                }}
              >
                <Skeleton animation='pulse' height={5} />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 4,
                  }}
                >
                  <Skeleton animation='pulse' style={EARNING_REV_EPS_SKELETON} height={5} />
                  <Skeleton animation='pulse' style={EARNING_REV_EPS_SKELETON} height={5} />
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 4,
                  }}
                >
                  <Skeleton animation='pulse' style={EARNING_REV_EPS_SKELETON} height={5} />
                  <Skeleton animation='pulse' style={EARNING_REV_EPS_SKELETON} height={5} />
                </View>
              </View>
            </View>
          </Animated.View>
        )
      })}
    </ScrollView>
  )
}

export default EarningPlaceholder
