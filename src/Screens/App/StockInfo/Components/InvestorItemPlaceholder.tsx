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
import { InvestorHolding, InvestorHoldingListScreenProps } from '../InvestorHoldingListScreen'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteStacks } from '@/Navigators/routes'

const windowWidth = Dimensions.get('window').width
interface InvestorItemPlaceholderProps {}

const InvestorItemPlaceholder: FC<InvestorItemPlaceholderProps> = ({}) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <View
      style={{
        backgroundColor: colors.white,
        marginVertical: 4,
        height: 70,
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}
    >
      <Skeleton style={{ marginVertical: 4 }} animation='pulse' height={8} />
      <Skeleton style={{ marginVertical: 4 }} animation='pulse' height={8} />
    </View>
  )
}

export default InvestorItemPlaceholder
