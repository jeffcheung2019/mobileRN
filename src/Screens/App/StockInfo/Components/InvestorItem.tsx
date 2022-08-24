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
import { InvestorHolding, InvestorHoldingListScreenNavigationProps } from '../InvestorHoldingListScreen'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteStacks } from '@/Navigators/routes'

const windowWidth = Dimensions.get('window').width
interface InvestorItemProps extends InvestorHolding {
  idx: number
  navigation: any
}

const InvestorItem: FC<InvestorItemProps> = ({ companyName, slug, profolioManager, idx }) => {
  const navigation = useNavigation<any>()

  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(idx * 500)}>
      <Pressable
        style={{
          backgroundColor: colors.white,
          paddingVertical: 8,
          paddingHorizontal: 8,
        }}
        onPress={() =>
          navigation.navigate(RouteStacks.investorHoldingDetail, {
            companyName,
            slug,
            profolioManager,
          })
        }
      >
        <View>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.darkBlueGray }}>{companyName}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 10, color: colors.darkBlueGray }}>{}</Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

export default InvestorItem
