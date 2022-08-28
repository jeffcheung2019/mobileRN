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
import Animated, { FadeInDown, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import DraggableCard from '@/Components/Buttons/Draggable/DraggableCard'
import DraggableCards from '@/Components/Buttons/Draggable/DraggableCard'
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs'
import { StockInfoStackNavigatorParamList, StockInfoStackScreenProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import axios from 'axios'
import * as cheerio from 'cheerio'
import map from 'lodash/map'

export type ShortInterestsScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoStackNavigatorParamList, RouteStacks.shortInterests>,
  StockInfoStackScreenProps
>

const ShortInterestsScreen: FC<ShortInterestsScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [shortInterestsRow, setShortInterestsRow] = useState<string[][]>([])

  useEffect(() => {
    const run = async () => {
      const shortInterestsRes = await axios.get(api.shortInterestsHtml)
      const cheerioDom = cheerio.load(shortInterestsRes.data)
      let shortInterestTable = cheerioDom('table')
      let shortInterestsTrDom = shortInterestTable.children('tbody').children('tr')
      let newShortInterestsRow = []
      for (let i = 0; i < shortInterestsTrDom.length; i++) {
        let shortInterestsTrTdDom = shortInterestsTrDom.eq(i).children('td')

        let tableRow = []
        for (let j = 0; j < shortInterestsTrTdDom.length; j++) {
          tableRow.push(
            shortInterestsTrTdDom
              .eq(j)
              .children(j === 0 ? '.fixed--cell' : '.cell__content')
              .text()
              .trim()
              .replace(/\n/g, ''),
          )
        }
        newShortInterestsRow.push(tableRow)
      }
      console.log('newShortInterestsRow', JSON.stringify(newShortInterestsRow, null, 2))
      setShortInterestsRow(newShortInterestsRow)
    }
    run()
  }, [])

  return (
    <ScreenBackgrounds screenName={RouteStacks.shortInterests}>
      <Header headerText={t('shortInterests')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
      <KeyboardAwareScrollView
        style={{
          backgroundColor: colors.brightGray,
        }}
        contentContainerStyle={[
          Gutters.smallHPadding,
          {
            backgroundColor: colors.brightGray,
            flexGrow: 1,
            justifyContent: 'flex-start',
          },
        ]}
      >
        {map(shortInterestsRow, (row, idx) => {
          return (
            <Animated.View
              style={{
                flexDirection: 'row',
                marginVertical: 4,
                paddingVertical: 8,
                paddingHorizontal: 8,
                borderRadius: 10,
                backgroundColor: colors.white,
              }}
              entering={FadeInDown.duration(500).delay(idx * 200)}
              key={`ShortInterestTicker-${idx}`}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: colors.darkBlueGray,
                      padding: 4,
                      width: 80,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 12,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      ${row[0]}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: colors.darkBlueGray,
                      fontSize: 12,
                      marginLeft: 8,
                      fontWeight: 'bold',
                    }}
                    numberOfLines={2}
                  >
                    {row[2]}
                  </Text>
                </View>

                <Text
                  style={{
                    color: colors.darkBlueGray,
                    fontSize: 12,
                    marginTop: 8,
                    fontWeight: 'bold',
                  }}
                >
                  {row[1]}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: colors.darkBlueGray,
                    fontSize: 12,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>{t('shortInterst')}:</Text>
                  {row[5]}
                </Text>

                <Text
                  style={{
                    color: colors.darkBlueGray,
                    fontSize: 12,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>{t('shortDate')}:</Text>
                  {row[6]}
                </Text>

                <Text
                  style={{
                    color: colors.darkBlueGray,
                    fontSize: 12,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>{t('float')}:</Text>
                  {row[7]}
                </Text>
                <Text
                  style={{
                    color: colors.darkBlueGray,
                    fontSize: 12,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>{t('shortRatio')}:</Text>
                  {row[8]}
                </Text>
              </View>
            </Animated.View>
          )
        })}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default ShortInterestsScreen
