import { colors } from '@/Utils/constants'
import React, { useState, useEffect, FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Image, FlatList } from 'react-native'
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

type SettingActionItemProps = {
  onActionItemPress: () => void
  title: string
  desc: string
  actionIcon: () => ReactNode
}

const SettingActionItem: FC<SettingActionItemProps> = ({ onActionItemPress, title, desc, actionIcon }) => {
  const styleSharedVal = useSharedValue({
    scale: 1,
    opacity: 1,
  })
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: styleSharedVal.value.scale,
        },
      ],
      opacity: styleSharedVal.value.opacity,
    }
  }, [])

  return (
    <Animated.View entering={FadeInDown.duration(1000)} style={containerAnimatedStyle}>
      <Pressable
        onPress={onActionItemPress}
        onPressIn={() => {
          styleSharedVal.value = {
            scale: 0.97,
            opacity: 0.9,
          }
        }}
        onPressOut={() => {
          styleSharedVal.value = {
            scale: 1,
            opacity: 1,
          }
        }}
        style={{
          height: 60,
          flexDirection: 'row',
          backgroundColor: colors.lotion,
          alignItems: 'center',
          borderRadius: 10,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flexBasis: 50,
          }}
        >
          {actionIcon()}
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 14, color: colors.darkBlueGray }}>{title}</Text>
          </View>

          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 10, color: colors.darkBlueGray }}>{desc}</Text>
          </View>
        </View>

        <View
          style={{
            flexBasis: 40,
            alignItems: 'flex-end',
          }}
        >
          <MaterialCommunityIcons size={22} name='chevron-right' color={colors.darkBlueGray} />
        </View>
      </Pressable>
    </Animated.View>
  )
}

export default SettingActionItem
