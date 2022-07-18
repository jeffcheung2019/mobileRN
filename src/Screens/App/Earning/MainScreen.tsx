import React, { useState, useEffect, useCallback, FC, useRef, RefObject, ForwardedRef, MutableRefObject } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Image, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { EarningScreenNavigatorParamList, EarningScreenNavigationProps } from '@/Screens/App/EarningScreen'
import { RouteStacks } from '@/Navigators/routes'
import { CompositeScreenProps } from '@react-navigation/native'
import { HomeScreenNavigatorParamList } from '../HomeScreen'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated from 'react-native-reanimated'
import EarningTableCard from '@/Components/Cards/EarningTableCard'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

type EarningMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<EarningScreenNavigatorParamList, RouteStacks.earningMain>,
  EarningScreenNavigationProps
>

type DraggableItem = {
  id: string
  title: string
}

const EarningMainScreen: FC<EarningMainScreenNavigationProps> = ({ navigation, route }) => {
  const draggableFlatListRef: any = useRef(null)
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  let tableHeaders = ['', t('Expected'), t('Reported'), t('Surprise(%)')]

  const [tableData, setTableData] = useState([
    [20.2, 33, 4],
    [20.4, 35, 4.1],
  ])

  return (
    <ScreenBackgrounds screenName={RouteStacks.earningMain}>
      <Animated.ScrollView style={Layout.fill} contentContainerStyle={[Layout.fill, Layout.colCenter, Gutters.smallHPadding]}>
        <View
          style={[
            Layout.fullWidth,
            {
              borderWidth: 1,
              borderRadius: 10,
              borderColor: colors.brightGray,
              paddingHorizontal: 10,
              padding: 10,
            },
          ]}
        >
          <EarningTableCard tableHeaders={tableHeaders} tableData={tableData} />
        </View>
      </Animated.ScrollView>
    </ScreenBackgrounds>
  )
}

export default EarningMainScreen
