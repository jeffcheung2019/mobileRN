import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { api, colors, config } from '@/Utils/constants'
import { RouteStacks, RouteTopTabs } from '@/Navigators/routes'
import { CompositeNavigationProp, CompositeScreenProps, useFocusEffect } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SharedElement } from 'react-navigation-shared-element'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { FadeInDown, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import DraggableCard from '@/Components/Buttons/Draggable/DraggableCard'
import DraggableCards from '@/Components/Buttons/Draggable/DraggableCard'
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import {
  StockInfoStackNavigatorParamList,
  StockInfoStackScreenNavigationProp,
  StockInfoStackScreenProps,
} from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { filter, map, throttle } from 'lodash'
import InvestorItem from './Components/InvestorItem'
import BrightGrayInput from '@/Components/Inputs/BrightGrayInput'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Skeleton } from '@rneui/themed'
import InvestorItemPlaceholder from './Components/InvestorItemPlaceholder'

export type InvestorHoldingListScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoStackNavigatorParamList, RouteStacks.investorHoldingList>,
  StockInfoStackScreenProps
>

export type InvestorHoldingListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<StockInfoStackNavigatorParamList, RouteStacks.investorHoldingList>,
  StockInfoStackScreenNavigationProp
>

export type InvestorHolding = {
  companyName: string
  slug?: string | undefined | null
  profolioManager?: string | undefined | null
}

const InvestorHoldingListScreen: FC<InvestorHoldingListScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [investorHoldingList, setInvestorHoldingList] = useState<InvestorHolding[]>([])
  const [searchText, setSearchText] = useState('')

  const onSearchTextChange = (text: string) => {
    setSearchText(text)
  }

  useFocusEffect(
    useCallback(() => {
      const run = async () => {
        try {
          let topInvestorsHtmlRes = await axios.get(api.topInvestorsHoldingHtml)
          const cheerioDom = cheerio.load(topInvestorsHtmlRes.data)
          let activistsTdDom = cheerioDom('#activists tr td')
          let tdLists: InvestorHolding[] = []
          let i = 1
          let investorDtl: InvestorHolding = {
            companyName: '',
          }

          while (i < activistsTdDom.length) {
            if (i !== 1 && i % 3 === 1) {
              tdLists.push(investorDtl)
              investorDtl = {
                companyName: '',
              }
            }

            if ([1, 2].includes(i % 3)) {
              if (i % 3 === 1) {
                investorDtl.companyName = activistsTdDom.eq(i).text()
                investorDtl.slug = activistsTdDom.children('a').attr()?.href
              } else {
                investorDtl.profolioManager = activistsTdDom.eq(i).text()
              }
              i += i % 3 === 1 ? 1 : 2
            }
          }
          setInvestorHoldingList(tdLists)
        } catch (err) {
          console.log('err ', err)
        }
      }

      run()
    }, []),
  )

  let filtereInvestors = useMemo(
    throttle(() => {
      return filter(investorHoldingList, (elem, idx) => {
        let profolioManager = elem.profolioManager
        let companyName = elem.companyName
        let searchTextLowerCase = searchText.toLowerCase()
        let tickerSymbolMatch = profolioManager?.toLowerCase().includes(searchTextLowerCase)
        let companyNameMatch = companyName?.toLowerCase().includes(searchTextLowerCase)

        return searchText === '' || tickerSymbolMatch || companyNameMatch
      })
    }, 600),
    [investorHoldingList, searchText],
  )

  return (
    <ScreenBackgrounds screenName={RouteStacks.investorHoldingList}>
      <Header headerText={t('investorHoldings')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
      <KeyboardAwareScrollView
        style={{
          backgroundColor: colors.brightGray,
        }}
        stickyHeaderIndices={[0]}
        contentContainerStyle={[
          Gutters.smallHPadding,
          {
            backgroundColor: colors.brightGray,
            flexGrow: 1,
            justifyContent: 'flex-start',
          },
        ]}
      >
        <View
          style={{
            paddingVertical: 8,
            backgroundColor: colors.brightGray,
          }}
        >
          <BrightGrayInput
            value={searchText}
            onChangeText={onSearchTextChange}
            icon={() => <MaterialIcons name='search' size={20} color={colors.darkBlueGray} />}
            textInputProps={{
              placeholder: t('searchInvestor'),
            }}
          />
        </View>
        {filtereInvestors === undefined || filtereInvestors.length === 0 ? (
          <>
            <InvestorItemPlaceholder />
            <InvestorItemPlaceholder />
            <InvestorItemPlaceholder />
            <InvestorItemPlaceholder />
            <InvestorItemPlaceholder />
            <InvestorItemPlaceholder />
            <InvestorItemPlaceholder />
            <InvestorItemPlaceholder />
          </>
        ) : (
          map(filtereInvestors, (elem, idx) => {
            return (
              <View key={`InvestorItem-${idx}`}>
                <InvestorItem {...elem} idx={idx} />
              </View>
            )
          })
        )}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default InvestorHoldingListScreen
