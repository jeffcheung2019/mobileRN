import React, { useState, useEffect, useCallback, FC, useMemo } from 'react'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import {
  StockInfoScreenNavigatorParamList,
  StockInfoStackScreenNavigationProp,
  StockInfoStackScreenProps,
} from '@/Screens/App/StockInfoScreen'
import { RouteStacks } from '@/Navigators/routes'
import { CompositeNavigationProp, CompositeScreenProps, useFocusEffect } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SharedElement } from 'react-navigation-shared-element'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  color,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutLeft,
  FadeOutRight,
  FadeOutUp,
  SequencedTransition,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutLeft,
  SlideOutRight,
  SlideOutUp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated'
import DraggableCard from '@/Components/Buttons/Draggable/DraggableCard'
import DraggableCards from '@/Components/Buttons/Draggable/DraggableCard'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useRealm } from '@/Realms/RealmContext'
import Entypo from 'react-native-vector-icons/Entypo'
import Header from '@/Components/Header'
import Foundation from 'react-native-vector-icons/Foundation'
import { triggerSnackbar } from '@/Utils/helpers'
import Octicons from 'react-native-vector-icons/Octicons'
import { RootState } from '@/Store'
import { updateStockInfoShowSection } from '@/Store/Slices/ui'
import keys from 'lodash/keys'
import Ionicons from 'react-native-vector-icons/Ionicons'

export type StockInfoMainScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.stockInfoMain>,
  StockInfoStackScreenProps
>

export type StockInfoMainScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<StockInfoScreenNavigatorParamList, RouteStacks.stockInfoMain>,
  StockInfoStackScreenNavigationProp
>
type SectionButton = {
  icon: () => React.ReactNode
  sectionType: keyof StockInfoShowSection
  redirectTo: keyof StockInfoScreenNavigatorParamList
}

const windowWidth = Dimensions.get('window').width

export const initStockInfoShowSection = {
  priceTargets: true,
  insiderTransactions: true,
  events: true,
  secFilings: true,
  investorHoldings: true,
  shortInterests: true,
  usEconomicData: true,
  euEconomicData: true,
  asianEconomicData: true,
  foodPriceIndex: true,
  globalSupplyChain: true,
  unusualOptions: true,
  offering: true,
  lawsuits: true,
  shortResearchReports: true,
  mergerAcquisition: true,
  ipoNews: true,
  cpiIndex: true,
}

export type StockInfoShowSectionType = keyof typeof initStockInfoShowSection

const sectionButtonsMap: Record<string, SectionButton> = {
  priceTargets: {
    icon: () => <MaterialCommunityIcons name='target' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'priceTargets',
    redirectTo: RouteStacks.priceTargetList,
  },
  insiderTransactions: {
    icon: () => <FontAwesome5 name='money-check-alt' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'insiderTransactions',
    redirectTo: RouteStacks.insiderTransactionList,
  },
  events: {
    icon: () => <MaterialIcons name='event' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'events',
    redirectTo: RouteStacks.eventList,
  },
  secFilings: {
    icon: () => <MaterialCommunityIcons name='file-document' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'secFilings',
    redirectTo: RouteStacks.secFilingList,
  },
  investorHoldings: {
    icon: () => <MaterialCommunityIcons name='human-male-board-poll' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'investorHoldings',
    redirectTo: RouteStacks.investorHoldingList,
  },
  shortInterests: {
    icon: () => <MaterialCommunityIcons name='file-document' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'shortInterests',
    redirectTo: RouteStacks.shortInterests,
  },
  usEconomicData: {
    icon: () => <Entypo name='bar-graph' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'usEconomicData',
    redirectTo: RouteStacks.usEconomicData,
  },
  euEconomicData: {
    icon: () => <Foundation name='graph-bar' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'euEconomicData',
    redirectTo: RouteStacks.euEconomicData,
  },
  asianEconomicData: {
    icon: () => <Foundation name='graph-trend' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'asianEconomicData',
    redirectTo: RouteStacks.asianEconomicData,
  },
  globalSupplyChain: {
    icon: () => <MaterialCommunityIcons name='truck-delivery' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'globalSupplyChain',
    redirectTo: RouteStacks.globalSupplyChain,
  },
  foodPriceIndex: {
    icon: () => <MaterialCommunityIcons name='food' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'foodPriceIndex',
    redirectTo: RouteStacks.foodPriceIndex,
  },
  unusualOptions: {
    icon: () => <MaterialIcons name='money' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'unusualOptions',
    redirectTo: RouteStacks.unusualOptions,
  },
  offering: {
    icon: () => <MaterialCommunityIcons name='offer' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'offering',
    redirectTo: RouteStacks.offering,
  },
  lawsuits: {
    icon: () => <Octicons name='law' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'lawsuits',
    redirectTo: RouteStacks.lawsuits,
  },
  shortResearchReports: {
    icon: () => <MaterialCommunityIcons name='archive-search' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'shortResearchReports',
    redirectTo: RouteStacks.shortResearchReports,
  },
  mergerAcquisition: {
    icon: () => <MaterialCommunityIcons name='merge' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'mergerAcquisition',
    redirectTo: RouteStacks.mergerAcquisition,
  },
  ipoNews: {
    icon: () => <Entypo name='news' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'ipoNews',
    redirectTo: RouteStacks.ipoNews,
  },
  cpiIndex: {
    icon: () => <Ionicons name='pricetags' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'cpiIndex',
    redirectTo: RouteStacks.cpiIndex,
  },
}

const sectionButtons: SectionButton[] = [
  {
    icon: () => <MaterialCommunityIcons name='target' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'priceTargets',
    redirectTo: RouteStacks.priceTargetList,
  },
  {
    icon: () => <FontAwesome5 name='money-check-alt' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'insiderTransactions',
    redirectTo: RouteStacks.insiderTransactionList,
  },
  {
    icon: () => <MaterialIcons name='event' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'events',
    redirectTo: RouteStacks.eventList,
  },
  {
    icon: () => <MaterialCommunityIcons name='file-document' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'secFilings',
    redirectTo: RouteStacks.secFilingList,
  },
  {
    icon: () => <MaterialCommunityIcons name='human-male-board-poll' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'investorHoldings',
    redirectTo: RouteStacks.investorHoldingList,
  },
  {
    icon: () => <MaterialCommunityIcons name='file-document' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'shortInterests',
    redirectTo: RouteStacks.shortInterests,
  },
  {
    icon: () => <Entypo name='bar-graph' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'usEconomicData',
    redirectTo: RouteStacks.usEconomicData,
  },
  {
    icon: () => <Foundation name='graph-bar' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'euEconomicData',
    redirectTo: RouteStacks.euEconomicData,
  },
  {
    icon: () => <Foundation name='graph-trend' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'asianEconomicData',
    redirectTo: RouteStacks.asianEconomicData,
  },
  {
    icon: () => <MaterialCommunityIcons name='truck-delivery' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'globalSupplyChain',
    redirectTo: RouteStacks.globalSupplyChain,
  },
  {
    icon: () => <MaterialCommunityIcons name='food' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'foodPriceIndex',
    redirectTo: RouteStacks.foodPriceIndex,
  },
  {
    icon: () => <MaterialCommunityIcons name='offer' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'offering',
    redirectTo: RouteStacks.offering,
  },
  {
    icon: () => <Octicons name='law' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'lawsuits',
    redirectTo: RouteStacks.lawsuits,
  },
  {
    icon: () => <MaterialCommunityIcons name='archive-search' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'shortResearchReports',
    redirectTo: RouteStacks.shortResearchReports,
  },
  {
    icon: () => <MaterialCommunityIcons name='merge' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'mergerAcquisition',
    redirectTo: RouteStacks.mergerAcquisition,
  },
  {
    icon: () => <FontAwesome5 name='money-check-alt' size={windowWidth / 14} color={colors.white} />,
    sectionType: 'ipoNews',
    redirectTo: RouteStacks.ipoNews,
  },
]

export type StockInfoShowSection = Record<StockInfoShowSectionType, boolean>

const StockInfoMainScreen: FC<StockInfoMainScreenProps> = ({ navigation, route }) => {
  const realm = useRealm()
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [showDelButton, setShowDelButton] = useState(false)
  const [unmountWholeScreen, setUnmountWholeScreen] = useState(false)
  const { stockInfoShowSection } = useSelector((state: RootState) => state.ui)
  const sectionRotateVal = useSharedValue(-1)

  const derivedRotateVal = useDerivedValue(() => {
    return withRepeat(
      withTiming(sectionRotateVal.value, {
        duration: 150,
      }),
      -1,
      true,
    )
  }, [])

  const stockInfoDisplayAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${derivedRotateVal.value}deg`,
        },
      ],
    }
  }, [])

  useEffect(() => {
    if (showDelButton) {
      sectionRotateVal.value = 1
    } else {
      sectionRotateVal.value = 0
    }
  }, [showDelButton])

  useFocusEffect(
    useCallback(() => {
      setUnmountWholeScreen(false)
      setShowDelButton(false)
    }, []),
  )

  const onSectionClosePress = (sectionType: string) => {
    dispatch(
      updateStockInfoShowSection({
        [sectionType]: false,
      }),
    )
  }
  const stockInfoShowSectionButtons = useMemo(() => {
    let res: SectionButton[] = []
    let objectKeys = (stockInfoShowSection ? Object.keys(stockInfoShowSection) : []) as Array<StockInfoShowSectionType>
    objectKeys.forEach((elem: StockInfoShowSectionType) => {
      if (stockInfoShowSection[elem]) {
        res.push(sectionButtonsMap[elem])
      }
    })
    return res
  }, [stockInfoShowSection])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      {unmountWholeScreen ? null : (
        <ScreenBackgrounds screenName={RouteStacks.stockInfoMain}>
          <KeyboardAwareScrollView
            style={(Layout.fill, {})}
            stickyHeaderIndices={[0]}
            contentContainerStyle={[Layout.fullSize, Layout.colCenter]}
          >
            <Header headerText={t('stockInfo')} />
            <ScrollView
              style={{
                flex: 1,
                width: '100%',
              }}
              contentContainerStyle={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: 0,
                paddingTop: 4,
              }}
            >
              {stockInfoShowSectionButtons.map((elem: SectionButton, idx: number) => {
                let enteringAnimation =
                  idx % 4 === 0
                    ? SlideInLeft.duration(500)
                    : idx % 4 === 1 || idx % 4 === 2
                    ? SlideInUp.duration(500)
                    : idx % 4 === 3
                    ? SlideInRight.duration(500)
                    : undefined

                return (
                  <Animated.View
                    style={[
                      {
                        flexBasis: windowWidth / 4,
                        height: windowWidth / 4,
                        padding: 4,
                      },
                      showDelButton && stockInfoDisplayAnimatedStyle,
                    ]}
                    key={`Section-${elem.sectionType}`}
                    layout={SequencedTransition.duration(1000).delay(500)}
                    entering={enteringAnimation}
                    exiting={FadeOut.duration(500)}
                  >
                    <Pressable
                      style={{
                        backgroundColor: colors.darkBlueGray,
                        borderRadius: 10,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onLongPress={() => setShowDelButton(!showDelButton)}
                      onPress={() => {
                        setUnmountWholeScreen(true)
                        setTimeout(() => {
                          navigation.navigate(elem.redirectTo)
                        }, 500)
                      }}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>{elem.icon()}</View>
                        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 4 }}>
                          <Text style={{ color: colors.white, fontSize: 10, textAlign: 'center' }}>{t(elem.sectionType)}</Text>
                        </View>
                      </View>
                    </Pressable>
                    {showDelButton && (
                      <Animated.View
                        entering={ZoomIn.duration(500)}
                        exiting={ZoomOut.duration(500)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                      >
                        <Pressable
                          style={{
                            borderRadius: 20,
                            width: 26,
                            height: 26,
                            backgroundColor: colors.white,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => onSectionClosePress(elem.sectionType)}
                        >
                          <MaterialCommunityIcons name='close-circle' size={26} color={colors.darkBlueGray} />
                        </Pressable>
                      </Animated.View>
                    )}
                  </Animated.View>
                )
              })}

              <Animated.View
                style={{
                  flexBasis: windowWidth / 4,
                  height: windowWidth / 4,
                  padding: 4,
                }}
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(500)}
                layout={SequencedTransition.duration(1000).delay(500)}
              >
                <Pressable
                  style={{
                    borderColor: colors.darkBlueGray,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderRadius: 10,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => navigation.navigate(RouteStacks.addWatchList)}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MaterialIcons
                      name='add-circle'
                      size={30}
                      color={colors.darkBlueGray}
                      style={{
                        paddingBottom: 10,
                      }}
                    />
                    <Text style={{ color: colors.darkBlueGray, fontSize: 12, textAlign: 'center' }}>{t('add')}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </ScreenBackgrounds>
      )}
    </View>
  )
}

export default StockInfoMainScreen
