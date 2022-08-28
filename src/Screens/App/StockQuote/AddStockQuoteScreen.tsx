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
import Header from '@/Components/Header'
import noDataGif from '@/Assets/Images/Illustrations/noData.gif'
import { StockQuoteScreenProps, StockQuoteScreenNavigatorParamList } from '../StockQuoteScreen'
import { getTickers } from '@/Queries/SearchTab'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import BrightGrayInput from '@/Components/Inputs/BrightGrayInput'
import map from 'lodash/map'
import FastImage from 'react-native-fast-image'

export type AddStockQuoteScreenProps = CompositeScreenProps<
  StackScreenProps<StockQuoteScreenNavigatorParamList, RouteStacks.addStockQuote>,
  StockQuoteScreenProps
>

const AddStockQuoteScreen: FC<AddStockQuoteScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')
  const tickers: any = getTickers(searchText)

  const onSearchTextChange = (text: string) => {
    setSearchText(text)
  }

  const onTickerPress = (ticker: string) => {}

  return (
    <ScreenBackgrounds screenName={RouteStacks.addStockQuote}>
      <Header headerText={t('addStockQuote')} withProfile={false} onLeftPress={() => navigation.navigate(RouteStacks.stockQuoteMain)} />
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingTop: 20,
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
        style={[Layout.fullWidth]}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingVertical: 10 }}
      >
        {tickers?.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FastImage
              source={noDataGif}
              style={{
                width: '100%',
                height: '40%',
              }}
              resizeMode='contain'
            />
            <Text
              style={{
                color: colors.darkBlueGray,
                fontSize: 14,
              }}
            >
              {t('noTickerFound')}
            </Text>
          </View>
        ) : (
          map(tickers, (elem, idx: number) => {
            return (
              <Animated.View entering={FadeInDown.delay(100 * idx).duration(300)} key={`TickerView-${idx}`}>
                <Pressable
                  key={`ticker-${elem.name}`}
                  onPress={() => onTickerPress(elem.ticker)}
                  style={[
                    Layout.fullWidth,
                    {
                      flexBasis: 50,
                      flexDirection: 'row',
                      borderWidth: 1,
                      paddingVertical: 10,
                      borderColor: colors.brightGray,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <View style={{ flex: 1, alignItems: 'flex-start', paddingHorizontal: 20 }}>
                    <SharedElement id={`ticker.${elem.ticker}`}>
                      <Text
                        numberOfLines={1}
                        style={{
                          textAlign: 'center',
                          fontSize: 14,
                          width: 80,
                          fontWeight: 'bold',
                          paddingHorizontal: 6,
                          paddingVertical: 6,
                          backgroundColor: colors.darkBlueGray,
                          color: colors.white,
                        }}
                      >
                        ${elem.ticker}
                      </Text>
                    </SharedElement>
                  </View>
                  <View style={{ flex: 2, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'left', fontSize: 14, color: colors.darkBlueGray }}>
                      {elem.name}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            )
          })
        )}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default AddStockQuoteScreen
