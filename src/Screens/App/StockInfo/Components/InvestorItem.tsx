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
import { InvestorHolding, InvestorHoldingListScreenNavigationProp, InvestorHoldingListScreenProps } from '../InvestorHoldingListScreen'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteStacks } from '@/Navigators/routes'

const windowWidth = Dimensions.get('window').width
interface InvestorItemProps extends InvestorHolding {
  idx: number
}

const InvestorItem: FC<InvestorItemProps> = ({ companyName, slug, profolioManager, idx }) => {
  const navigation = useNavigation<InvestorHoldingListScreenNavigationProp>()

  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  return (
    <Animated.View
      style={{
        backgroundColor: colors.white,
        borderRadius: 10,
        marginVertical: 4,
        width: '100%',
        height: 60,
        paddingHorizontal: 16,
        justifyContent: 'center',
      }}
      entering={FadeInDown.duration(300).delay(idx * 100)}
    >
      <Pressable
        style={{
          backgroundColor: colors.white,
          width: '100%',
          paddingVertical: 8,
          paddingHorizontal: 8,
          height: 50,
          justifyContent: 'center',
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
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.darkBlueGray }} numberOfLines={2}>
            {companyName}
          </Text>
        </View>
        {![null, undefined, ''].includes(profolioManager) ? (
          <View>
            <Text style={{ fontSize: 12, color: colors.darkBlueGray }}>{profolioManager}</Text>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  )
}

export default InvestorItem
