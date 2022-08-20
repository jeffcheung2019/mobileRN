import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { getNewsItemPanel, NewsItem, PriceTarget } from '@/Queries/SearchTab'
import map from 'lodash/map'
import moment from 'moment'
import { moneyConvertToKMB } from '@/Utils/helpers'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { queryConstants } from '@/Queries/Constants'
import Animated, { Keyframe, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

type NotiSubscribeButtonProps = {
  onPress: () => void
}

const NotiSubscribeButton: FC<NotiSubscribeButtonProps> = ({ onPress }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const pressState = useSharedValue<boolean>(false)
  const notiSharedVal = useSharedValue(0)
  const notiAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${withTiming(notiSharedVal.value, {
            duration: 2000,
          })}deg`,
        },
      ],
    }
  })

  return (
    <Pressable
      style={{
        flex: 1,
        alignItems: 'flex-end',
        paddingHorizontal: 10,
      }}
      onPress={onPress}
      onPressIn={() => (notiSharedVal.value = 20)}
      onPressOut={() => (notiSharedVal.value = 0)}
    >
      <Animated.View style={[notiAnimatedStyle]}>
        <MaterialIcons name={'notifications'} size={config.iconSize} color={colors.darkBlueGray} />
      </Animated.View>
    </Pressable>
  )
}

export default NotiSubscribeButton
