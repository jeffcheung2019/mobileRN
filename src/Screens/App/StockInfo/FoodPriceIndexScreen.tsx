import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
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
import { StockInfoScreenNavigatorParamList, StockInfoStackScreenProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import axios from 'axios'
import { FoodPriceIndexZoom } from '@/Types/API'
import LineStockChart from '@/Components/Graph/LineStockChart'

export type foodPriceIndexScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.foodPriceIndex>,
  StockInfoStackScreenProps
>
const windowWidth = Dimensions.get('window').width
let abortController = new AbortController()
const foodPriceIndexScreen: FC<foodPriceIndexScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [zoomType, setZoomType] = useState<FoodPriceIndexZoom>('1')
  const [graphData, setGraphData] = useState()
  //zoom possible values 1, 2, 5, 6m, ytd,

  useEffect(() => {
    const run = async () => {
      let [foodPriceIndexRes, foodPriceIndexHtml] = await Promise.all([
        axios.get(api.foodPriceIndex(zoomType), {
          signal: abortController.signal,
        }),
        axios.get(api.foodPriceIndexHtml, {
          signal: abortController.signal,
        }),
      ])

      console.log('foodPriceIndexRes ', foodPriceIndexRes)

      console.log('foodPriceIndexRes', foodPriceIndexRes.data?.chart_data[0][0].raw_data)
      let rawData = foodPriceIndexRes.data?.chart_data[0][0]?.raw_data

      // console.log('foodPriceIndexHtml ', foodPriceIndexHtml)
    }
    run()
    return () => {
      abortController.abort()
    }
  }, [zoomType])

  return (
    <ScreenBackgrounds screenName={RouteStacks.foodPriceIndex}>
      <Header headerText={t('foodPriceIndex')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
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
        {/* <LineStockChart
              chartData={chartData}
              width={windowWidth}
              height={250}
              priceChangePercent={priceChangePercent}
              lowest={lowest}
              highest={highest}
            /> */}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default foodPriceIndexScreen
