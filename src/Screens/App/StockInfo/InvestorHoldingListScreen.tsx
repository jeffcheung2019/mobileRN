import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { api, colors, config } from '@/Utils/constants'
import { RouteStacks, RouteTopTabs } from '@/Navigators/routes'
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SharedElement } from 'react-navigation-shared-element'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import DraggableCard from '@/Components/Buttons/Draggable/DraggableCard'
import DraggableCards from '@/Components/Buttons/Draggable/DraggableCard'
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import { StockInfoStackNavigatorParamList, StockInfoStackNavigationProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import axios from 'axios'
import * as cheerio from 'cheerio'

export type InvestorHoldingListScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<StockInfoStackNavigatorParamList, RouteStacks.investorHoldingList>,
  StockInfoStackNavigationProps
>

export type InvestorHolding = {
  companyName: string
  slug?: string | undefined | null
  profolioManager?: string | undefined | null
}

const InvestorHoldingListScreen: FC<InvestorHoldingListScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [investorHoldingList, setInvestorHoldingList] = useState([])
  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        try {
          let topInvestorsHtmlRes = await axios.get(api.topInvestorsHoldingHtml)
          const cheerioDom = cheerio.load(topInvestorsHtmlRes.data)
          let activistsTdOrA = cheerioDom('#activists tr td')
          let lists: InvestorHolding[] = []
          let i = 1
          let detail: InvestorHolding = {
            companyName: '',
          }
          while (i < activistsTdOrA.length) {
            if (i !== 1 && i % 3 === 1) {
              lists.push(detail)
              detail = {
                companyName: '',
              }
            }
            if ([1, 2].includes(i % 3)) {
              i += i % 3 === 1 ? 1 : 2
              if (i % 3 === 1) {
                detail.companyName = activistsTdOrA.eq(i).text()
                detail.slug = activistsTdOrA.children('a').attr()?.href
              } else {
                detail.profolioManager = activistsTdOrA.eq(i).text()
              }
            }
          }

          console.log('lists: ', JSON.stringify(lists, null, 2))
        } catch (err) {
          console.log('err ', err)
        }
      }

      run()
    }, []),
  )

  return (
    <ScreenBackgrounds screenName={RouteStacks.investorHoldingList}>
      <Header headerText={t('investorHoldings')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
      <KeyboardAwareScrollView style={Layout.fill} contentContainerStyle={[Layout.fullSize, Layout.colCenter, Gutters.smallHPadding]}>
        {investorHoldingList}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default InvestorHoldingListScreen
