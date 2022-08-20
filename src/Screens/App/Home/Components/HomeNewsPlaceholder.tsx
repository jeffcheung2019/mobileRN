import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { Skeleton } from '@rneui/themed'

const HomeNewsPlaceholder: FC = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <View
      style={{
        paddingHorizontal: 10,
        flexDirection: 'row',
        height: 90,
        paddingVertical: 5,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingRight: 10,
        }}
      >
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' height={80} />
      </View>

      <View
        style={{
          flex: 2,
          justifyContent: 'center',
        }}
      >
        <Skeleton style={{ marginVertical: 2 }} animation='pulse' width={100} height={6} />
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

export default HomeNewsPlaceholder
