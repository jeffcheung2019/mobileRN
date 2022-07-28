/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback, FC, useRef, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  TextStyle,
  Platform,
  Alert,
  ViewStyle,
  RefreshControl,
  Image,
  Dimensions,
  Linking,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login, logout } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'
// @ts-ignore
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { HomeScreenNavigatorParamList } from '@/Screens/App/HomeScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { RouteStacks, RouteTabs } from '@/Navigators/routes'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { MainTabNavigatorParamList } from '@/Navigators/MainStackNavigator'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import ActionButton from '@/Components/Buttons/ActionButton'
import CircleButton from '@/Components/Buttons/CircleButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { awsLogout, triggerSnackbar } from '@/Utils/helpers'
import times from 'lodash/times'
// @ts-ignore
import { Auth } from 'aws-amplify'
import axios, { Canceler, CancelTokenSource } from 'axios'
import { RootState } from '@/Store'
import CircularProgress from 'react-native-circular-progress-indicator'
import { startLoading } from '@/Store/UI/actions'

import { Results } from 'realm'
import { forEach, map } from 'lodash'
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import InAppBrowser from 'react-native-inappbrowser-reborn'
//@ts-ignore
import { Table, TableWrapper, Col, Cols, Cell, Row } from 'react-native-table-component'

type EarningTableCardProps = {
  tableHeaders: string[]
  tableData: number[][]
}

const EarningTableCard: FC<EarningTableCardProps> = ({ tableHeaders, tableData }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()

  return (
    <Table borderStyle={{ backgroundColor: colors.brightGray }}>
      <Row data={tableHeaders} style={{ color: colors.darkBlueGray }} />
      <TableWrapper style={{ flexDirection: 'row' }}>
        <TableWrapper style={{ width: 80 }}>
          <Cell data={t('EPS')} style={{ color: colors.darkBlueGray }} />
          <Cell data={t('Revenue')} style={{ color: colors.darkBlueGray }} />
        </TableWrapper>
        <TableWrapper style={{ flex: 1 }}>
          {tableData.map((rowData, index) => (
            <TableWrapper key={index} style={{ height: 50, flexDirection: 'row' }}>
              {rowData.map((cellData, cellIndex) => (
                <Cell key={cellIndex} data={cellData} style={{ color: colors.spanishGray }} />
              ))}
            </TableWrapper>
          ))}
        </TableWrapper>
      </TableWrapper>
    </Table>
  )
}

export default EarningTableCard
