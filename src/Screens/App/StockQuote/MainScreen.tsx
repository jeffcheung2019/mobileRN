import React, { useState, useEffect, useCallback, FC, useRef } from 'react'
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
import { StockQuoteScreenNavigationProps, StockQuoteScreenNavigatorParamList } from '../StockQuoteScreen'
import Header from '@/Components/Header'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Animated, { FadeInDown } from 'react-native-reanimated'
import TickerQuote from './Components/TickerQuote'
import { useRealm } from '@/Realms/RealmContext'
import { StockQuoteTab } from '@/Realms/Schemas/StockQuoteTabSchema'
import { map } from 'lodash'
import StockQuoteTabItem from './Components/StockQuoteTabItem'
import ObjectId from 'bson-objectid'

type StockQuoteMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<StockQuoteScreenNavigatorParamList, RouteStacks.stockQuoteMain>,
  StockQuoteScreenNavigationProps
>

const StockQuoteMainScreen: FC<StockQuoteMainScreenNavigationProps> = ({ navigation, route }) => {
  const realm = useRealm()
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [stockQuoteTab, setStockQuoteTab] = useState<StockQuoteTab[]>([])
  const [currStockQuoteTab, setCurrStockQuoteTab] = useState(0)

  useEffect(() => {
    if (realm) {
      let realmStockQuoteTabs = realm?.objects<StockQuoteTab>('StockQuoteTab') ?? []
      let newStockQuoteTab = []
      for (let i = 0; i < realmStockQuoteTabs.length; i++) {
        newStockQuoteTab.push({
          tabName: realmStockQuoteTabs[i].tabName,
          tickers: realmStockQuoteTabs[i].tickers,
        })
      }
      setStockQuoteTab(newStockQuoteTab)
    }
  }, [realm])

  const onAddStockQuoteTabPress = () => {
    realm?.write(() => {
      // realm.create("StockQuoteTab", {
      //   _id: ObjectId(),
      // })
    })
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.stockQuoteMain}>
      <Header headerText={t('stockQuote')} />
      <KeyboardAwareScrollView
        style={{
          backgroundColor: colors.brightGray,
          flex: 1,
        }}
        contentContainerStyle={[
          Layout.fill,
          Layout.colCenter,
          Gutters.smallHPadding,
          {
            backgroundColor: colors.brightGray,
            justifyContent: 'flex-start',
            flex: 1,
          },
        ]}
      >
        <View
          style={{
            height: 50,
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <ScrollView
            horizontal
            style={{
              width: '100%',
            }}
            contentContainerStyle={{
              paddingVertical: 4,
              alignItems: 'center',
              width: '100%',
            }}
          >
            {map(stockQuoteTab, (elem, idx) => {
              return <StockQuoteTabItem currTab={currStockQuoteTab} tabIdx={idx} tabName={elem.tabName} />
            })}
            <Pressable onPress={onAddStockQuoteTabPress}>
              <Ionicons name='add-circle' size={config.iconSize} color={colors.darkBlueGray} />
            </Pressable>
          </ScrollView>
          <Pressable
            style={{
              flexBasis: 50,
              backgroundColor: colors.red,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onAddStockQuoteTabPress}
          >
            <MaterialCommunityIcons
              name='delete'
              size={config.iconSize}
              color={currStockQuoteTab !== 0 ? colors.darkBlueGray : colors.white}
            />
          </Pressable>
        </View>

        <TickerQuote ticker={'UPST'} />
        <Animated.View
          entering={FadeInDown}
          style={{
            height: 50,
            width: '100%',
          }}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: 'center',
              borderStyle: 'dashed',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: 10,
              flexDirection: 'row',
              marginVertical: 4,
              borderColor: colors.darkBlueGray,
            }}
            onPress={() => navigation.navigate(RouteStacks.addStockQuote)}
          >
            <Ionicons name='add-circle' size={config.iconSize} color={colors.darkBlueGray} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: colors.darkBlueGray,
                marginLeft: 20,
              }}
            >
              {t('addStockQuote')}
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default StockQuoteMainScreen