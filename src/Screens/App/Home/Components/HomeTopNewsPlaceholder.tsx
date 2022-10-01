import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { Skeleton } from '@rneui/themed'

const HomeTopNewsPlaceholder: FC = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <View
      style={{
        height: 300,
        width: '100%',
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          height: 200,
          width: '100%',
        }}
      >
        <Skeleton style={{ width: '100%' }} animation='pulse' height={200} />
      </View>

      <View
        style={{
          height: 40,
          paddingVertical: 10,
        }}
      >
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' width={50} height={6} />
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' height={6} />
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' height={6} />
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' height={6} />
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' height={6} />
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' height={6} />
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' height={6} />
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' height={6} />
      </View>
    </View>
  )
}

export default HomeTopNewsPlaceholder
