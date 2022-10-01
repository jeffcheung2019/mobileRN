import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { api, colors, config, zoomTypesDateRangeMap } from '@/Utils/constants'
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
import * as cheerio from 'cheerio'
import axios from 'axios'
import AreaChart from '@/Components/Graph/AreaChart'
import { ZoomType } from '@/Types/API'
import moment from 'moment'
import { GraphPoint } from '@/Types/Graph'
import { BarChart } from 'react-native-gifted-charts'
import CustomBarChart from '@/Components/Graph/CustomBarChart'

export type CpiIndexScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.cpiIndex>,
  StockInfoStackScreenProps
>

const zoomTypes = Object.keys(zoomTypesDateRangeMap) as Array<ZoomType>

let abortController: AbortController
const windowWidth = Dimensions.get('window').width
const CpiIndexScreen: FC<CpiIndexScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [cpiIndexTableData, setCpiIndexTableData] = useState<string[][]>([])
  const [selectedZoomType, setSelectedZoomType] = useState<ZoomType>('6M')
  const [allChartData, setAllChartData] = useState<GraphPoint[]>([])
  const [chartDtl, setChartDtl] = useState<{
    chartData: GraphPoint[]
    highest: number
    lowest: number
  }>({
    chartData: [],
    highest: 0,
    lowest: 0,
  })

  useEffect(() => {
    const run = async () => {
      abortController = new AbortController()
      let [cpiIndexRes, cpiIndexDataJsonRes] = await Promise.all([axios.get(api.cpiIndexHtml), axios.get(api.cpiIndexDataJson)])

      let cpiIndexDataJson = cpiIndexDataJsonRes?.data?.data
      // console.log('cpiIndexDataJson', cpiIndexDataJson)
      let cpiIndexDataArr = []
      let end = cpiIndexDataJson.length
      // default is 6M
      let start = end - zoomTypesDateRangeMap['6M']
      let newAllChartData: GraphPoint[] = []
      let newChartData: GraphPoint[] = []
      let newLowest = Number.MAX_SAFE_INTEGER
      let newHighest = -newLowest
      for (let i = 0; i < end; i++) {
        let tableRow = []
        let currY = cpiIndexDataJson[i][1]
        if (i >= start && i < end) {
          newChartData.push({
            // x: moment(cpiIndexDataJson[i][0]).unix(),
            date: cpiIndexDataJson[i][0],
            value: currY,
            // y: currY,
          })
          if (newHighest < currY) {
            newHighest = currY
          }
          if (newLowest > currY) {
            newLowest = currY
          }
        }
        newAllChartData.push({
          // x: moment(cpiIndexDataJson[i][0]).unix(),
          // y: cpiIndexDataJson[i][1],
          date: cpiIndexDataJson[i][0],
          value: currY,
        })
      }

      let newCpiIndexTableData = []
      const cheerioDom = cheerio.load(cpiIndexRes.data)
      let cpiIndexTable = cheerioDom('#eventHistoryTable733')
      let cpiIndexTrDom = cpiIndexTable.children('tbody').children('tr')
      for (let i = 0; i < cpiIndexTrDom.length; i++) {
        let cpiIndexTrTdDom = cpiIndexTrDom.eq(i).children('td')
        let tableRow = []
        for (let j = 1; j < cpiIndexTrTdDom.length - 2; j++) {
          if (j === 1) {
            tableRow.push(`${cpiIndexTrTdDom.eq(0).text()} ${cpiIndexTrTdDom.eq(1).text()}`)
          } else {
            tableRow.push(cpiIndexTrTdDom.eq(j).text())
          }
        }
        newCpiIndexTableData.push(tableRow)
      }
      setCpiIndexTableData(newCpiIndexTableData)
      setChartDtl({
        chartData: newChartData,
        lowest: newLowest,
        highest: newHighest,
      })
      setAllChartData(newAllChartData)
    }

    run()
  }, [])

  useEffect(() => {
    if (allChartData?.length !== 0) {
      let newLowest = Number.MAX_SAFE_INTEGER
      let newHighest = -newLowest
      let end = allChartData.length
      let start = end - zoomTypesDateRangeMap[selectedZoomType]
      let newChartData = []
      for (let i = start; i < end; i++) {
        let tableRow = []
        let currY = allChartData[i].value
        if (i >= start && i < end) {
          newChartData.push({
            // x: allChartData[i].x,
            // y: currY,
            date: allChartData[i].date,
            value: currY,
          })
          if (newHighest < currY) {
            newHighest = currY
          }
          if (newLowest > currY) {
            newLowest = currY
          }
        }
      }
      setChartDtl({
        lowest: newLowest,
        highest: newHighest,
        chartData: newChartData,
      })
    }
  }, [selectedZoomType, allChartData])

  const onZoomTypeBtnPress = (newZoomType: ZoomType) => {
    setSelectedZoomType(newZoomType)
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.usEconomicData}>
      <Header headerText={t('cpiIndex')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
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
            {zoomTypes.map((zoomType: ZoomType, idx) => {
              return (
                <Pressable
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: colors.darkBlueGray,
                    marginHorizontal: 4,
                    backgroundColor: selectedZoomType === zoomType ? colors.darkBlueGray : colors.transparent,
                  }}
                  onPress={() => onZoomTypeBtnPress(zoomType)}
                  key={`ZoomOption-${zoomType}`}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 12,
                      color: selectedZoomType === zoomType ? colors.white : colors.darkBlueGray,
                    }}
                  >
                    {zoomType}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        </Animated.View>
        <View
          style={{
            paddingHorizontal: 10,
          }}
        >
          <AreaChart
            chartData={chartDtl.chartData}
            highest={chartDtl.highest + 1}
            lowest={chartDtl.lowest - 1}
            height={200}
            width={windowWidth + 30}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              flexBasis: 20,
            }}
          >
            {[t('time'), t('actual'), t('forcast')].map((col, idx) => {
              return (
                <View
                  style={{
                    flex: idx === 0 ? 3 : 1,
                  }}
                  key={`${col}`}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: colors.darkBlueGray,
                    }}
                  >
                    {col}
                  </Text>
                </View>
              )
            })}
          </View>

          {cpiIndexTableData.map((row: string[], idx) => {
            return (
              <View
                key={`CPIIndexRow${idx}`}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}
              >
                {row.map((elem, sIdx) => {
                  return (
                    <View
                      style={{
                        flex: sIdx === 0 ? 3 : 1,
                      }}
                      key={`CPIIndexRow${idx}Col${sIdx}`}
                    >
                      <Text
                        style={{
                          color: colors.darkBlueGray,
                          fontSize: 12,
                          textAlign: 'center',
                        }}
                      >
                        {elem}
                      </Text>
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default CpiIndexScreen
