import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { RouteStacks, RouteTabs, RouteTopTabs } from '@/Navigators/routes'
import { CompositeScreenProps } from '@react-navigation/native'
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
import { StockInfoScreenNavigatorParamList, StockInfoStackScreenProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import { getRatingsPanel, getTickers, GetTickersResult } from '@/Queries/SearchTab'
import moment from 'moment'
import BrightGrayInput from '@/Components/Inputs/BrightGrayInput'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export type PriceTargetListScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.insiderTransactionList>,
  StockInfoStackScreenProps
>

const RATING_VIEW: ViewStyle = {
  backgroundColor: colors.darkBlueGray,
  paddingVertical: 4,
  paddingHorizontal: 6,
  borderRadius: 4,
}

const PriceTargetListScreen: FC<PriceTargetListScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')

  const tickers: GetTickersResult[] = getTickers(searchText) ?? []

  const onSearchTextChange = (text: string) => {
    setSearchText(text)
  }
  let tickersId = tickers.map((elem: GetTickersResult) => elem.id)
  const ratingsPanelData = getRatingsPanel(tickersId, 20)

  return (
    <ScreenBackgrounds screenName={RouteStacks.priceTargetList}>
      <Header headerText={t('priceTargets')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />

      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <BrightGrayInput
          value={searchText}
          onChangeText={onSearchTextChange}
          icon={() => <MaterialIcons name='search' size={20} color={colors.darkBlueGray} />}
          textInputProps={{
            autoCapitalize: 'characters',
            placeholder: t('searchTickerPrompt'),
          }}
        />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          Gutters.smallHPadding,
          {
            flexGrow: 1,
            justifyContent: 'flex-start',
          },
        ]}
      >
        {ratingsPanelData === undefined
          ? null
          : ratingsPanelData?.map((elem, idx) => {
              const { rating, ratingPrior, pt, ptPrior, analyst, date, ticker, name, id } = elem
              return (
                <Animated.View
                  entering={FadeInDown.duration(500).delay(idx * 100)}
                  key={`PriceTargetFeed-${idx}`}
                  style={{
                    paddingHorizontal: 10,
                  }}
                >
                  <Pressable
                    onPress={() => {
                      navigation.navigate(RouteTabs.search, {
                        screen: RouteStacks.tickerDetail,
                        params: {
                          id: id,
                          ticker: ticker,
                          name: name,
                          prevScreen: {
                            tab: RouteTabs.stockInfo,
                            stack: RouteStacks.priceTargetList,
                          },
                        },
                      })
                    }}
                    style={{
                      flexDirection: 'row',
                      height: 80,
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                      }}
                    >
                      <View style={{ flex: 5, alignItems: 'flex-start', justifyContent: 'center' }}>
                        <View
                          style={{
                            backgroundColor: colors.darkBlueGray,
                            borderRadius: 4,
                            padding: 6,
                            marginRight: 4,
                            marginBottom: 4,
                          }}
                        >
                          <Text style={{ fontSize: 10, color: colors.white, fontWeight: 'bold' }}>${ticker}</Text>
                        </View>
                        <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                          <Text style={{ fontWeight: 'bold' }}>{t('date')}:</Text>
                          {`  ${moment(date).format('DD-MM-YYYY')}`}
                        </Text>
                        <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                          <Text style={{ fontWeight: 'bold' }}>{t('analyst')}:</Text> {` ${analyst}`}
                        </Text>
                        <Text style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                          <Text style={{ fontWeight: 'bold' }}>{t('priceTargetChange')}:</Text> {ptPrior !== null ? `$${ptPrior}` : ''}{' '}
                          {ptPrior ? '->' : ''} {`$${pt}`}
                        </Text>
                      </View>
                      <View style={{ flex: 5, paddingLeft: 20, alignItems: 'flex-start', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                          {ratingPrior ? (
                            <View style={[RATING_VIEW]}>
                              <Text style={{ fontWeight: 'bold', color: colors.white, fontSize: 9 }}>{ratingPrior}</Text>
                            </View>
                          ) : null}
                          {ratingPrior ? (
                            <View style={{ justifyContent: 'center', paddingHorizontal: 8 }}>
                              {<Text style={{ color: colors.darkBlueGray, fontSize: 9 }}>{'->'}</Text>}
                            </View>
                          ) : null}
                          <View style={[RATING_VIEW]}>
                            <Text style={{ fontWeight: 'bold', color: colors.white, fontSize: 9 }}>{rating}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              )
            })}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default PriceTargetListScreen
