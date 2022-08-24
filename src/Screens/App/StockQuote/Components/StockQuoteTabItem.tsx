import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import times from 'lodash/times'
import { Skeleton } from '@rneui/themed'
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from 'react-native-reanimated'
import { useFinanceGraph } from '@/Hooks/useFinanceGraph'
import LineStockChart from '@/Components/Graph/LineStockChart'

const windowWidth = Dimensions.get('window').width
type StockQuoteTabItemProps = {
  currTab: number
  tabIdx: number
  tabName: string
}

const StockQuoteTabItem: FC<StockQuoteTabItemProps> = ({ currTab, tabIdx, tabName }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Pressable
      style={{
        borderWidth: 1,
        borderColor: colors.darkBlueGray,
        borderRadius: 20,
        marginRight: 4,
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: currTab === tabIdx ? colors.darkBlueGray : colors.white,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: currTab !== tabIdx ? colors.darkBlueGray : colors.white,
          fontSize: 12,
        }}
      >
        {tabName}
      </Text>
    </Pressable>
  )
}

export default StockQuoteTabItem
