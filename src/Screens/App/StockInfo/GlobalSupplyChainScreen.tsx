import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
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
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import DraggableCard from '@/Components/Buttons/Draggable/DraggableCard'
import DraggableCards from '@/Components/Buttons/Draggable/DraggableCard'
import { StockInfoScreenNavigatorParamList, StockInfoStackScreenProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import AreaChart from '@/Components/Graph/AreaChart'
import axios from 'axios'
import moment from 'moment'
import { GraphPoint } from '@/Types/Graph'
import { Skeleton } from '@rneui/themed'
import { ZoomType } from '@/Types/API'

export type GlobalSupplyChainScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.globalSupplyChain>,
  StockInfoStackScreenProps
>

const zoomTypes = Object.keys(zoomTypesDateRangeMap) as Array<ZoomType>
const windowWidth = Dimensions.get('window').width

let abortController: AbortController
const GlobalSupplyChainScreen: FC<GlobalSupplyChainScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [chartData, setChartData] = useState<GraphPoint[]>([])
  const [selectedZoomType, setSelectedZoomType] = useState<ZoomType>('6M')
  useEffect(() => {
    const run = async () => {
      abortController = new AbortController()
      const gscCsvRes = await axios.get(api.globalSupplyChainCSV, {
        signal: abortController.signal,
      })
      let newChartData: GraphPoint[] = []
      let csvRow = gscCsvRes.data.split('\r\n')

      let end = csvRow.length - 1
      let start = end - zoomTypesDateRangeMap[selectedZoomType]
      // 0 & csvRow.length - 1 must be excluded
      for (let i = start; i < csvRow.length - 1; i++) {
        let csvRowSplit = csvRow[i].split(',')
        newChartData.push({
          date: moment(csvRowSplit[0], 'DD-MMM-YYYY').toDate(),
          value: Number(csvRowSplit[csvRowSplit.length - 1]),
        })
      }

      setChartData(newChartData)
    }

    run()

    return () => {
      abortController.abort()
    }
  }, [selectedZoomType])

  const onChartOptionPress = (chartOpt: ZoomType) => {
    setSelectedZoomType(chartOpt)
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.globalSupplyChain}>
      <Header headerText={t('globalSupplyChain')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
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
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
          }}
        >
          <Text
            style={{
              color: colors.darkBlueGray,
              fontSize: 12,
            }}
          >
            {t('globalSupplyChainIndexDesc')}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ScrollView horizontal contentContainerStyle={{}}>
            {zoomTypes.map((zoomType, idx) => {
              return (
                <Pressable
                  key={`GlobalSupplyChainIndex-${idx}`}
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: colors.darkBlueGray,
                    marginHorizontal: 4,
                    backgroundColor: selectedZoomType === zoomType ? colors.darkBlueGray : colors.transparent,
                  }}
                  onPress={() => onChartOptionPress(zoomType)}
                >
                  <Text
                    style={{
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
          <Text
            style={{
              color: colors.darkBlueGray,
              fontSize: 12,
              fontWeight: '700',
              paddingTop: 20,
            }}
          >
            {t('standardDeviationFromAvg')}
          </Text>
        </View>

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
          <AreaChart chartData={chartData} width={windowWidth + 30} height={250} />
        )}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default GlobalSupplyChainScreen
