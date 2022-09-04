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
import { StockInfoScreenNavigatorParamList, StockInfoStackScreenProps } from '@/Screens/App/StockInfoScreen'
import Header from '@/Components/Header'
import map from 'lodash/map'
import { initStockInfoShowSection, StockInfoShowSection, StockInfoShowSectionType } from './MainScreen'
import { Switch } from '@rneui/themed'
import { updateStockInfoShowSection } from '@/Store/Slices/ui'
import { RootState } from '@/Store'

export type AddWatchListScreenProps = CompositeScreenProps<
  StackScreenProps<StockInfoScreenNavigatorParamList, RouteStacks.addWatchList>,
  StockInfoStackScreenProps
>

const SWITCH_SECTION_VIEW: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 8,
  flexBasis: 50,
}

const AddWatchListScreen: FC<AddWatchListScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [showAll, setShowAll] = useState(false)
  const { stockInfoShowSection } = useSelector((state: RootState) => state.ui)

  const onSwitchValChange = (displaySection: string, newSwitchVal: boolean) => {
    dispatch(
      updateStockInfoShowSection({
        ...stockInfoShowSection,
        [displaySection]: newSwitchVal,
      }),
    )
  }

  const onShowAllChange = () => {
    let newShowAll = !showAll
    setShowAll(newShowAll)
    let objKeysStockInfoShowSection = Object.keys(stockInfoShowSection) as Array<StockInfoShowSectionType>
    let newStockInfoShowSection: StockInfoShowSection = { ...initStockInfoShowSection }
    for (let i = 0; i < objKeysStockInfoShowSection.length; i++) {
      let elem = objKeysStockInfoShowSection[i]
      newStockInfoShowSection[objKeysStockInfoShowSection[i]] = newShowAll
    }
    dispatch(updateStockInfoShowSection(newStockInfoShowSection))
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.addWatchList}>
      <Header headerText={t('addWatchList')} onLeftPress={() => navigation.navigate(RouteStacks.stockInfoMain)} withProfile={false} />
      <KeyboardAwareScrollView
        style={Layout.fill}
        contentContainerStyle={[
          Layout.colCenter,
          {
            paddingVertical: 10,
            paddingHorizontal: 30,
          },
        ]}
      >
        <View
          style={[
            SWITCH_SECTION_VIEW,
            {
              backgroundColor: colors.white,
              flexDirection: 'row',
            },
          ]}
        >
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: colors.darkBlueGray, fontWeight: 'bold' }}>{t('all')}</Text>
          </View>

          <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
            <Switch value={showAll} onValueChange={onShowAllChange} />
          </View>
        </View>
        {map(Object.keys(initStockInfoShowSection), (elem: StockInfoShowSectionType, idx) => {
          return (
            <Animated.View
              style={[SWITCH_SECTION_VIEW, {}]}
              key={`NotificationSectionsSwitch-${idx}`}
              entering={FadeInDown.duration(200).delay(idx * 100)}
            >
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: 16, color: colors.darkBlueGray, fontWeight: 'bold' }}>{t(elem)}</Text>
              </View>

              <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
                <Switch value={stockInfoShowSection[elem]} onValueChange={value => onSwitchValChange(elem, value)} />
              </View>
            </Animated.View>
          )
        })}
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default AddWatchListScreen
