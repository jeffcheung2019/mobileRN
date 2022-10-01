import React, { useState, useEffect, useCallback, FC, useRef } from 'react'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { RouteStacks } from '@/Navigators/routes'
import { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StockQuoteScreenProps, StockQuoteScreenNavigatorParamList, StockQuoteScreenNavigationProp } from '../StockQuoteScreen'
import Header from '@/Components/Header'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Animated, { FadeInDown } from 'react-native-reanimated'
import TickerQuote from './Components/TickerQuote'
import { useRealm } from '@/Realms/RealmContext'
import { SubscribedStockQuote } from '@/Realms/Schemas/StockQuoteTab/SubscribedStockQuoteSchema'
import { map } from 'lodash'
import StockQuoteTabItem from './Components/StockQuoteTabItem'
import ObjectId from 'bson-objectid'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AddStockQuoteModal from '@/Components/Modals/AddStockQuoteTabModal'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Modal from 'react-native-modalbox'

export type StockQuoteMainScreenProps = CompositeScreenProps<
  StackScreenProps<StockQuoteScreenNavigatorParamList, RouteStacks.stockQuoteMain>,
  StockQuoteScreenProps
>

export type StockQuoteMainScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<StockQuoteScreenNavigatorParamList, RouteStacks.stockQuoteMain>,
  StockQuoteScreenNavigationProp
>

const StockQuoteMainScreen: FC<StockQuoteMainScreenProps> = ({ navigation, route }) => {
  const addStockQuoteModalRef = useRef<Modal>(null)
  const realm = useRealm()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [stockQuoteTab, setStockQuoteTab] = useState<SubscribedStockQuote[]>([])
  const [currStockQuoteTab, setCurrStockQuoteTab] = useState(0)
  const [currTab, setCurrTab] = useState<number>(0)

  useEffect(() => {
    if (realm) {
      let realmStockQuoteTabs = realm?.objects<SubscribedStockQuote>('SubscribedStockQuote') ?? []
      let newStockQuoteTab = []
      for (let i = 0; i < realmStockQuoteTabs.length; i++) {
        newStockQuoteTab.push({
          tabName: realmStockQuoteTabs[i].tabName,
          stockTickerDetails: realmStockQuoteTabs[i].stockTickerDetails,
        })
      }
      setStockQuoteTab(newStockQuoteTab)
    }
  }, [realm])

  const onAddStockQuoteTabPress = () => {
    // realm?.write(() => {
    //   // realm.create("SubscribedStockQuote", {
    //   //   _id: ObjectId(),
    //   // })
    // })

    addStockQuoteModalRef?.current?.open()
  }

  const onUpdateStockQuoteTabPress = () => {}

  const onAddStockQuoteModalClose = () => {}

  console.log('stockQuoteTab', stockQuoteTab)

  return (
    <ScreenBackgrounds screenName={RouteStacks.stockQuoteMain}>
      <AddStockQuoteModal ref={addStockQuoteModalRef} onModalClose={onAddStockQuoteModalClose} />
      <Header headerText={t('stockQuote')} />
      <KeyboardAwareScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={[
          {
            justifyContent: 'flex-start',
            flex: 1,
          },
        ]}
      >
        {stockQuoteTab.length === 0 ? (
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={onAddStockQuoteTabPress}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.brightGray,
              }}
            >
              <MaterialIcons name='addchart' size={40} color={colors.darkBlueGray} />
              <Text
                style={{
                  color: colors.darkBlueGray,
                  paddingTop: 20,
                  fontWeight: 'bold',
                }}
              >
                {t('startSettingUpWatchListTab')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View
              style={{
                height: 50,
                justifyContent: 'center',
                flexDirection: 'row',
                marginVertical: 8,
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
                  paddingLeft: 4,
                }}
              >
                {map(stockQuoteTab, (elem, idx) => {
                  return (
                    <View key={`StockQuoteTab-${idx}`}>
                      <StockQuoteTabItem currTab={currStockQuoteTab} tabIdx={idx} tabName={elem.tabName} />
                    </View>
                  )
                })}
                <Pressable
                  onPress={onAddStockQuoteTabPress}
                  style={{
                    backgroundColor: colors.darkBlueGray,
                    borderRadius: 99,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 30,
                    height: 30,
                  }}
                >
                  <MaterialIcons name='add' size={20} color={colors.white} style={{}} />
                </Pressable>
              </ScrollView>
              <View
                style={{
                  justifyContent: 'center',
                  paddingRight: 4,
                }}
              >
                <Pressable
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: colors.darkBlueGray,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 99,
                  }}
                  onPress={onUpdateStockQuoteTabPress}
                  disabled={stockQuoteTab.length === 0}
                >
                  <MaterialCommunityIcons
                    name={'pencil-outline'}
                    size={20}
                    color={currStockQuoteTab !== 0 ? colors.darkBlueGray : colors.white}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  paddingRight: 4,
                }}
              >
                <Pressable
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: colors.crimson,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 99,
                  }}
                  onPress={onAddStockQuoteTabPress}
                  disabled={stockQuoteTab.length <= 1}
                >
                  <MaterialCommunityIcons name='delete' size={20} color={currStockQuoteTab !== 0 ? colors.darkBlueGray : colors.white} />
                </Pressable>
              </View>
            </View>

            <ScrollView
              style={{
                width: '100%',
                flex: 1,
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexGrow: 1,
              }}
            >
              {/* <TickerQuote navigation={navigation} id={1} ticker={'UPST'} /> */}
            </ScrollView>

            <Animated.View
              entering={FadeInDown}
              style={{
                height: 70,
                width: '100%',
                paddingVertical: 6,
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
                onPress={() => navigation.navigate(RouteStacks.addStockQuote, {})}
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
          </>
        )}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default StockQuoteMainScreen
