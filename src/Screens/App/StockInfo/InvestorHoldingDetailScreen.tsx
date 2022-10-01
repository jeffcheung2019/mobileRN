import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { api, colors, config } from '@/Utils/constants'
import { RouteStacks } from '@/Navigators/routes'
import { CompositeNavigationProp, CompositeScreenProps, useNavigation } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SharedElement } from 'react-navigation-shared-element'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import DraggableCard from '@/Components/Buttons/Draggable/DraggableCard'
import DraggableCards from '@/Components/Buttons/Draggable/DraggableCard'
import {
  StockInfoScreenNavigatorParamList,
  StockInfoStackScreenNavigationProp,
  StockInfoStackScreenProps,
} from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import axios from 'axios'
import * as cheerio from 'cheerio'
import map from 'lodash/map'

export type InvestorHoldingDetailScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.investorHoldingDetail>,
  StockInfoStackScreenProps
>

export type InvestorHoldingDetailNavigationProp = CompositeNavigationProp<
  StackNavigationProp<StockInfoScreenNavigatorParamList, RouteStacks.investorHoldingDetail>,
  StockInfoStackScreenNavigationProp
>

const FILING_ROW_TEXT: TextStyle = {
  color: colors.darkBlueGray,
  fontSize: 10,
}

const FILING_ROW_TEXT_FIELD: TextStyle = {
  fontWeight: 'bold',
}

//https://www.newyorkfed.org/research/policy/gscpi#/interactive

const InvestorHoldingDetailScreen: FC<InvestorHoldingDetailScreenProps> = ({ navigation, route }) => {
  const { companyName, slug, profolioManager } = route?.params
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [filing13dg, setFiling13dg] = useState<string[][]>([])
  useEffect(() => {
    const run = async () => {
      try {
        let investorHtmlRes = await axios.get(`${api.investorHtmlPrefix}${slug}`)
        const cheerioDom = cheerio.load(investorHtmlRes.data)
        let filing13dgTable = cheerioDom('.table').eq(3)
        let filingTrDom = filing13dgTable.children('tbody').children('tr')
        let newFiling13dg = []
        for (let i = 0; i < filingTrDom.length; i++) {
          let filingTrTdDom = filingTrDom.eq(i).children('td')
          let tableRow = []
          for (let j = 0; j < filingTrTdDom.length; j++) {
            tableRow.push(filingTrTdDom.eq(j).text())
          }
          newFiling13dg.push(tableRow)
        }
        setFiling13dg(newFiling13dg)
      } catch (err) {}
    }
    run()
  }, [])

  return (
    <ScreenBackgrounds screenName={RouteStacks.investorHoldingDetail}>
      <Header headerText={companyName} onLeftPress={() => navigation.navigate(RouteStacks.investorHoldingList)} withProfile={false} />
      <KeyboardAwareScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={[
          Layout.colCenter,
          Gutters.smallHPadding,
          {
            flexGrow: 1,
            paddingVertical: 4,
          },
        ]}
      >
        {map(filing13dg, (row, idx) => {
          let tickerCompanyNameSplit = row[2].split(' / ')
          let ticker = tickerCompanyNameSplit[0]
          let companyName = tickerCompanyNameSplit[1]

          return (
            <Animated.View
              style={{
                paddingVertical: 8,
                marginVertical: 4,
                paddingHorizontal: 12,
                borderRadius: 10,
                alignItems: 'flex-start',
                backgroundColor: colors.white,
              }}
              key={`Filing13dg-${idx}`}
              entering={FadeInDown.duration(500)}
            >
              <View
                style={{
                  height: 22,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.darkBlueGray,
                    paddingHorizontal: 4,
                    paddingVertical: 4,
                    marginRight: 8,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: colors.white,
                      fontSize: 12,
                    }}
                  >
                    {!['', null, undefined].includes(ticker) ? `$${ticker}` : ''}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: colors.darkBlueGray,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                  >
                    {!['', null, undefined].includes(companyName) ? `${companyName}` : ''}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <View style={[{ flex: 1, justifyContent: 'flex-start' }]}>
                  <Text style={[FILING_ROW_TEXT]}>
                    <Text style={[FILING_ROW_TEXT_FIELD]}>{t('form')}:</Text> {row[1] !== '' ? row[1] : '-'}
                  </Text>
                  <Text style={[FILING_ROW_TEXT]}>
                    <Text style={[FILING_ROW_TEXT_FIELD]}>{t('prevShares')}:</Text> {row[4] !== '' ? row[4] : '-'}
                  </Text>
                  <Text style={[FILING_ROW_TEXT]}>
                    <Text style={[FILING_ROW_TEXT_FIELD]}>{t('ownershipPercent')}:</Text> {row[7] !== '' ? row[7] : '-'}%
                  </Text>
                </View>

                <View style={[{ flex: 1 }]}>
                  <Text style={[FILING_ROW_TEXT]}>
                    <Text style={[FILING_ROW_TEXT_FIELD]}>{t('filingDate')}:</Text> {row[0] !== '' ? row[0] : '-'}
                  </Text>

                  <Text style={[FILING_ROW_TEXT]}>
                    <Text style={[FILING_ROW_TEXT_FIELD]}>{t('currShares')}:</Text> {row[5] !== '' ? row[5] : '-'}
                  </Text>

                  <Text style={[FILING_ROW_TEXT]}>
                    <Text style={[FILING_ROW_TEXT_FIELD]}>{t('ownershipPercentChange')}:</Text> {row[8] !== '' ? `${row[8]}%` : '-'}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )
        })}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default InvestorHoldingDetailScreen
