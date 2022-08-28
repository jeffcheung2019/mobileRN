import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { RouteStacks, RouteTopTabs } from '@/Navigators/routes'
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
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import { StockInfoStackNavigatorParamList, StockInfoStackScreenProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import axios from 'axios'
import map from 'lodash/map'
import * as cheerio from 'cheerio'
import RenderHTML from 'react-native-render-html'
import { Skeleton } from '@rneui/base'

const windowWidth = Dimensions.get('window').width
export type OfferingDetailScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoStackNavigatorParamList, RouteStacks.offeringDetail>,
  StockInfoStackScreenProps
>

const OFFERING_DETAIL_SKELETON: ViewStyle = {
  marginVertical: 8,
}

const OfferingDetailScreen: FC<OfferingDetailScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const { url, tickers, title } = route?.params
  const [newsDtl, setNewsDtl] = useState<string[]>([])

  useEffect(() => {
    const run = async () => {
      const offeringDtlRes = await axios.get(url)
      const cheerioDom = cheerio.load(offeringDtlRes.data)
      let coreBlockP = cheerioDom('li.core-block')
      let tmpNewsDtl = []
      for (let i = 0; i < coreBlockP.length; i++) {
        console.log('=> ', coreBlockP.eq(i).text())
        tmpNewsDtl.push(
          coreBlockP
            .eq(i)
            .text()
            .trim()
            .replace(/[/\t]+/g, ''),
        )
      }
      console.log('url', url)
      setNewsDtl(tmpNewsDtl)
    }
    if (!['', null, undefined].includes(url)) {
      run()
    }
  }, [url])

  return (
    <ScreenBackgrounds screenName={RouteStacks.offeringDetail}>
      <Header onLeftPress={() => navigation.navigate(RouteStacks.offering)} withProfile={false} />
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
        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
          {map(tickers, (ticker, idx) => {
            return (
              <View
                style={{
                  backgroundColor: colors.darkBlueGray,
                  borderRadius: 4,
                  paddingVertical: 4,
                  paddingHorizontal: 4,
                  marginRight: 4,
                }}
                key={`Ticker-${idx}`}
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
        <View style={{ paddingBottom: 8 }}>
          <Text
            style={{
              color: colors.darkBlueGray,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {title}
          </Text>
        </View>
        {newsDtl.length > 0 ? (
          <View>
            {map(newsDtl, (elem, idx) => {
              return (
                <View
                  style={{
                    justifyContent: 'flex-start',
                    marginBottom: 10,
                  }}
                  key={`OfferingDetail-${idx}`}
                >
                  <Text
                    style={{
                      color: colors.darkBlueGray,
                      textAlign: 'left',
                      fontSize: 16,
                    }}
                  >
                    {elem}
                  </Text>
                </View>
              )
            })}
          </View>
        ) : (
          <View>
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
            <Skeleton animation='pulse' style={OFFERING_DETAIL_SKELETON} height={10} />
          </View>
        )}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default OfferingDetailScreen
