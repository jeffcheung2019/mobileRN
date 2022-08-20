import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { View, ActivityIndicator, Text, TextInput, ScrollView, TextStyle, Alert, ViewStyle, Pressable, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { MainTabNavigatorParamList, MainTabNavigatorProps } from '@/Navigators/MainStackNavigator'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ActionButton from '@/Components/Buttons/ActionButton'
import { Header } from '@/Components'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { CompositeScreenProps } from '@react-navigation/native'
import { gql, useQuery } from '@apollo/client'
import map from 'lodash/map'
import { StackScreenProps } from '@react-navigation/stack'
import { SearchScreenNavigationProps, SearchScreenNavigatorParamList } from '../SearchScreen'
import { getTickers } from '@/Queries/SearchTab'
import { SharedElement } from 'react-navigation-shared-element'
import Animated, { FadeInDown } from 'react-native-reanimated'
import noDataGif from '@/Assets/Images/Illustrations/noData.gif'
import BrightGrayInput from '@/Components/Inputs/BrightGrayInput'

export type SearchMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<SearchScreenNavigatorParamList, RouteStacks.searchMain>,
  SearchScreenNavigationProps
>

const SearchMainScreen: FC<SearchMainScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const params = route!.params || { username: null }

  const [searchText, setSearchText] = useState('')
  const tickers: any = getTickers(searchText)

  const onSearchTextChange = (text: string) => {
    setSearchText(text)
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.searchMain}>
      <Header headerText={t('searchTicker')} withProfile={false} />
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
            <Image
              source={noDataGif}
              style={{
                height: '40%',
                resizeMode: 'contain',
              }}
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
                  onPress={() => {
                    navigation.navigate(RouteStacks.tickerDetail, {
                      ticker: elem.ticker,
                      id: elem.id,
                      name: elem.name,
                    })
                  }}
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

export default SearchMainScreen
