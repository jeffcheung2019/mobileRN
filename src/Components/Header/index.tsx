import React, { FC, useState } from 'react'
import { View, ViewStyle, TextStyle, Pressable, Text, TextInput, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Spacing } from '@/Theme/Variables'
import backBtn from '@/Assets/Images/buttons/back.png'
import { useTheme } from '@/Hooks'
import { colors, config } from '@/Utils/constants'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux'
import { RootState } from '@/Store'
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated'
import { SharedElement } from 'react-navigation-shared-element'
import FastImage from 'react-native-fast-image'

export const headerHeight = 60

const windowWidth = Dimensions.get('window').width

// Header with profile will have notification bell

const Header = (props: {
  onLeftPress?: () => void
  onRightPress?: () => void
  onProfilePress?: () => void
  rightIcon?: () => React.ReactNode
  leftIcon?: () => React.ReactNode
  headerText?: string
  withProfile?: boolean
}) => {
  const { onLeftPress, onRightPress, onProfilePress, rightIcon, leftIcon, headerText, withProfile } = props

  const { Common, Fonts, Gutters, Layout } = useTheme()
  const { t } = useTranslation()

  const { username } = useSelector((state: RootState) => state.user)
  let isSocialSignIn = username.includes('Google') || username.includes('Facebook') || username.includes('SignInWithApple')
  return (
    <View
      style={{
        flexDirection: 'row',
        height: headerHeight,
        width: windowWidth,
        borderBottomColor: !withProfile && headerText === undefined && onLeftPress === undefined ? colors.transparent : colors.brightGray,
        borderBottomWidth: 1,
      }}
    >
      {onLeftPress ? (
        <View
          style={{
            paddingBottom: 4,
            flex: 1,
            flexDirection: 'row',
          }}
        >
          <Animated.View
            entering={FadeInRight.duration(1000)}
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Pressable
              onPress={onLeftPress}
              style={{
                paddingLeft: 20,
              }}
            >
              <MaterialCommunityIcons name='arrow-left' size={config.iconSize} color={colors.darkBlueGray} />
            </Pressable>
          </Animated.View>
          <View
            style={{
              flex: 3,
              justifyContent: 'center',
            }}
          >
            <Text numberOfLines={2} style={[{ color: colors.darkBlueGray, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }]}>
              {headerText}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
            }}
          ></View>
        </View>
      ) : !withProfile ? (
        <View
          style={{
            flex: 3,
            justifyContent: 'center',
            paddingBottom: 4,
          }}
        >
          <Text style={[{ color: colors.darkBlueGray, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }]}>{headerText}</Text>
        </View>
      ) : (
        <View
          style={{
            flex: 4,
            height: '100%',
            alignItems: 'flex-start',
            paddingLeft: 20,
            justifyContent: 'center',
            flexDirection: 'row',
            paddingBottom: 4,
          }}
        >
          <Pressable
            onPress={onProfilePress}
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <FastImage
              source={{ uri: config.defaultAvatarUrl, priority: FastImage.priority.high }}
              resizeMode='contain'
              style={{ width: 36, height: 36, borderRadius: 99 }}
            />
          </Pressable>

          <View
            style={{
              flex: 6,
              paddingLeft: 20,
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <Text style={[{ color: colors.darkBlueGray, fontSize: 18, fontWeight: 'bold' }]}>
                {isSocialSignIn ? t('user') : username}
              </Text>
            </View>
          </View>

          {rightIcon && (
            <View style={{ flex: 1, justifyContent: 'center', height: '100%', alignItems: 'center', paddingRight: 10 }}>{rightIcon()}</View>
          )}
        </View>
      )}
    </View>
  )
}

export default Header
