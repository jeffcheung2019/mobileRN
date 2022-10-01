import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { api, colors, config, zoomOptions } from '@/Utils/constants'
import { RouteStacks } from '@/Navigators/routes'
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
import axios from 'axios'
import { FoodPriceIndexZoomType } from '@/Types/API'
import LineStockChart from '@/Components/Graph/LineStockChart'
import { get } from 'lodash'
import { GraphPoint } from '@/Types/Graph'
import AreaChart from '@/Components/Graph/AreaChart'
import * as cheerio from 'cheerio'
import moment from 'moment'
import { Skeleton } from '@rneui/base'

export type foodPriceIndexScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.foodPriceIndex>,
  StockInfoStackScreenProps
>
const windowWidth = Dimensions.get('window').width

const SKELETON_PLACEHOLDER: ViewStyle = {
  borderRadius: 4,
  marginVertical: 4,
}
const foodPriceIndexZoomOptions: {
  value: FoodPriceIndexZoomType
  label: string
}[] = [
  {
    value: '6m',
    label: '6M',
  },
  {
    value: 'ytd',
    label: 'YTD',
  },
  {
    value: '1',
    label: '1Y',
  },
  {
    value: '2',
    label: '2Y',
  },
  {
    value: '3',
    label: '3Y',
  },
]
let abortController: AbortController
const foodPriceIndexScreen: FC<foodPriceIndexScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [zoomType, setZoomType] = useState<FoodPriceIndexZoomType>('1')
  const [chartData, setChartData] = useState<GraphPoint[]>([])
  //zoom possible values 1, 2, 3, 6m, ytd,

  useEffect(() => {
    const run = async () => {
      abortController = new AbortController()
      let foodPriceIndexRes = await axios.get(api.foodPriceIndex(zoomType), {
        signal: abortController.signal,
      })

      let rawData = get(foodPriceIndexRes, 'data.chart_data[0][0].raw_data', [])

      let newChartData: GraphPoint[] = []
      for (let i = 0; i < rawData.length; i++) {
        newChartData.push({
          value: rawData[i][1],
          date: rawData[i][0],
        })
      }

      setChartData(newChartData)
    }
    run()
    return () => {
      abortController.abort()
    }
  }, [zoomType])

  const onZoomTypeBtnPress = (newZoomType: FoodPriceIndexZoomType) => {
    setZoomType(newZoomType)
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.foodPriceIndex}>
      <Header headerText={t('foodPriceIndex')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
      <KeyboardAwareScrollView
        style={{}}
        contentContainerStyle={[
          {
            flexGrow: 1,
            justifyContent: 'flex-start',
            paddingTop: 10,
          },
        ]}
      >
        <Animated.View
          style={{
            height: 46,
            paddingVertical: 10,
          }}
          entering={FadeInDown.duration(1000)}
        >
          <ScrollView
            horizontal
            contentContainerStyle={{
              width: '100%',
              justifyContent: 'center',
            }}
            style={{
              height: 30,
              width: '100%',
            }}
          >
            {foodPriceIndexZoomOptions.map((zoomOpt, idx) => {
              return (
                <Pressable
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: colors.darkBlueGray,
                    marginHorizontal: 4,
                    backgroundColor: zoomType === zoomOpt.value ? colors.darkBlueGray : colors.transparent,
                  }}
                  onPress={() => onZoomTypeBtnPress(zoomOpt.value)}
                  key={`ZoomOption-${zoomOpt.value}`}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 12,
                      color: zoomType === zoomOpt.value ? colors.white : colors.darkBlueGray,
                    }}
                  >
                    {zoomOpt.label}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        </Animated.View>
        <Animated.View
          style={{
            height: 250,
            paddingHorizontal: 20,
          }}
        >
          {chartData.length === 0 ? (
            <View
              style={{
                paddingHorizontal: 30,
                paddingVertical: 20,
              }}
            >
              <Skeleton
                height={210}
                style={{
                  borderRadius: 4,
                }}
              />
            </View>
          ) : (
            <AreaChart chartData={chartData} width={windowWidth + 20} height={250} />
          )}
        </Animated.View>
        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 10,
          }}
        >
          {chartData.length === 0 ? (
            <>
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
              <Skeleton height={8} style={SKELETON_PLACEHOLDER} />
            </>
          ) : (
            <ScrollView
              contentContainerStyle={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                paddingLeft: 20,
                paddingBottom: 20,
              }}
            >
              {chartData.map((elem, idx) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '50%',
                      paddingVertical: 10,
                      paddingLeft: idx % 2 === 1 ? 20 : 0,
                    }}
                    key={`CharData-${idx}`}
                  >
                    <Text
                      style={{
                        color: colors.darkBlueGray,
                        fontSize: 12,
                        flex: 1,
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                      numberOfLines={1}
                    >
                      {moment(elem.date).format('DD-MMM')}:
                    </Text>
                    <Text
                      style={{
                        color: colors.darkBlueGray,
                        fontSize: 12,
                        textAlign: 'left',
                        flex: 1,
                      }}
                    >
                      {elem.value}
                    </Text>
                  </View>
                )
              })}
            </ScrollView>
          )}
        </Animated.View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default foodPriceIndexScreen
