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
import { getNewsItemPanel, NewsItem } from '@/Queries/SearchTab'
import { queryConstants } from '@/Queries/Constants'
import map from 'lodash/map'
import InAppBrowser from 'react-native-inappbrowser-reborn'

export type SecFilingListScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.secFilingList>,
  StockInfoStackScreenProps
>

const SecFilingListScreen: FC<SecFilingListScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const secFilings: NewsItem[] | undefined = getNewsItemPanel(
    [],
    queryConstants.getNewsItemPanel.secFiling.sourceIds,
    queryConstants.getNewsItemPanel.secFiling.categoryIds,
    30,
  )

  console.log('secFilings', JSON.stringify(secFilings, null, 2))

  return (
    <ScreenBackgrounds screenName={RouteStacks.secFilingList}>
      <Header headerText={t('secFilings')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
      <KeyboardAwareScrollView
        style={{}}
        contentContainerStyle={[
          Gutters.smallHPadding,
          {
            flexGrow: 1,
            justifyContent: 'flex-start',
            paddingHorizontal: 30,
          },
        ]}
      >
        {map(secFilings, (sec, idx: number) => {
          return (
            <Pressable
              style={{
                height: 70,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              key={`SecFiling-${idx}`}
              onPress={() => InAppBrowser.open(sec.link)}
            >
              {
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 4, justifyContent: 'center' }}>
                    <View style={{ flexBasis: 14 }}>
                      <Text numberOfLines={1} style={{ color: colors.darkBlueGray, fontSize: 12, fontWeight: 'bold' }}>
                        {sec.title}
                      </Text>
                    </View>
                    <View style={{ paddingBottom: 4 }}>
                      <Text numberOfLines={2} style={{ color: colors.darkBlueGray, fontSize: 10 }}>
                        {sec.summary}
                      </Text>
                    </View>
                    {[null, undefined, ''].includes(sec.ticker) ? null : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                          style={{
                            backgroundColor: colors.darkBlueGray,
                            borderRadius: 4,
                            paddingHorizontal: 4,
                            paddingVertical: 4,
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: 12,
                              color: colors.white,
                            }}
                          >
                            ${sec.ticker}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              }
            </Pressable>
          )
        })}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default SecFilingListScreen
