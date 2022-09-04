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
import { CompositeScreenProps } from '@react-navigation/native'
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
import {
  StockInfoScreenNavigatorParamList,
  StockInfoStackScreenNavigationProp,
  StockInfoStackScreenProps,
} from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import axios from 'axios'
import map from 'lodash/map'
import FastImage from 'react-native-fast-image'

export type OfferingScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.offering>,
  StockInfoStackScreenProps
>

type OfferingNews = {
  title: string
  url: string
  tickers: {
    companyName: string
    tickerName: string
  }[]
}

const OfferingScreen: FC<OfferingScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [newsOffset, setNewsOffset] = useState(0)
  const [news, setNews] = useState<OfferingNews[]>([])

  useEffect(() => {
    const run = async () => {
      let benzingOfferingNewsRes = await axios.get(api.benzingaOfferingNews(newsOffset, 40))

      let benzingOfferingNewsData = benzingOfferingNewsRes.data
      let newNews = []
      for (let i = 0; i < benzingOfferingNewsData.length; i++) {
        if (benzingOfferingNewsData[i].title.includes('Offering')) {
          newNews.push({
            // image: benzingOfferingNewsData[i].image,
            title: benzingOfferingNewsData[i].title,
            url: benzingOfferingNewsData[i].url,
            tickers: benzingOfferingNewsData[i].tickers.map((e: any) => {
              return {
                companyName: e.description,
                tickerName: e.name,
              }
            }),
          })
        }
      }
      setNews(newNews)
    }

    run()
  }, [newsOffset])

  console.log('news ', news[0])

  return (
    <ScreenBackgrounds screenName={RouteStacks.offering}>
      <Header headerText={t('offering')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
      <KeyboardAwareScrollView
        style={{}}
        contentContainerStyle={[
          Gutters.smallHPadding,
          {
            flexGrow: 1,
            justifyContent: 'flex-start',
          },
        ]}
      >
        {map(news, (e, idx) => {
          return (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 4,
                paddingVertical: 10,
              }}
              onPress={() => {
                navigation.navigate(RouteStacks.offeringDetail, {
                  url: e.url,
                  tickers: e.tickers,
                  title: e.title,
                })
              }}
            >
              <View
                style={{
                  flex: 1,
                  paddingLeft: 10,
                }}
              >
                <Text style={{ color: colors.darkBlueGray, fontSize: 12, paddingBottom: 4, fontWeight: 'bold' }}>{e.title}</Text>
                <View style={{ flexDirection: 'row' }}>
                  {map(e.tickers, (ticker, sIdx) => {
                    return (
                      <View
                        style={{
                          backgroundColor: colors.darkBlueGray,
                          borderRadius: 4,
                          paddingVertical: 4,
                          paddingHorizontal: 4,
                          marginRight: 4,
                        }}
                        key={`Ticker-${idx}-${sIdx}`}
                      >
                        <Text
                          style={{
                            color: colors.white,
                            fontWeight: 'bold',
                          }}
                        >
                          ${ticker.tickerName}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            </Pressable>
          )
        })}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default OfferingScreen
