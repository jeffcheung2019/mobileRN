import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import times from 'lodash/times'
import { Skeleton } from '@rneui/themed'
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  SequencedTransition,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated'
import { useFinanceGraph } from '@/Hooks/useFinanceGraph'
import LineStockChart from '@/Components/Graph/LineStockChart'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RouteStacks } from '@/Navigators/routes'
import { StockInfoMainScreenNavigationProp } from '../MainScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StockInfoScreenNavigatorParamList } from '../../StockInfoScreen'

const windowWidth = Dimensions.get('window').width
interface StockInfoSectionItemProps {
  navigation: StockInfoMainScreenNavigationProp
  idx: number
  showDelButton: boolean
  sectionType: string
  setShowDelButton: (showDelButton: boolean) => void
  setUnmountWholeScreen: (unmountWholeScreen: boolean) => void
  redirectTo: keyof StockInfoScreenNavigatorParamList
  icon: () => React.ReactNode
  onSectionClosePress: (sectionType: string) => void
}

const StockInfoSectionItem: FC<StockInfoSectionItemProps> = ({
  navigation,
  idx,
  showDelButton,
  sectionType,
  setShowDelButton,
  setUnmountWholeScreen,
  redirectTo,
  icon,
  onSectionClosePress,
}) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

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
    sectionRotateVal.value = 1
  }, [])

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
      layout={SequencedTransition.duration(1000).delay(500)}
      entering={enteringAnimation}
      exiting={FadeOut.duration(500)}
      key={`Section-${sectionType}`}
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
            navigation.navigate(redirectTo)
          }, 500)
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>{icon()}</View>
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 4 }}>
            <Text style={{ color: colors.white, fontSize: 10, textAlign: 'center' }}>{t(sectionType)}</Text>
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
            onPress={() => onSectionClosePress(sectionType)}
          >
            <MaterialCommunityIcons name='close-circle' size={26} color={colors.darkBlueGray} />
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  )
}

export default StockInfoSectionItem
