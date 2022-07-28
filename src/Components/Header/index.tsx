import React, { FC, useState } from 'react'
import { View, ViewStyle, TextStyle, Pressable, Text, Image, TextInput, Dimensions } from 'react-native'
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
import Animated from 'react-native-reanimated'

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
      }}
    >
      {onLeftPress ? (
        <>
          <View
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
              <MaterialCommunityIcons name='chevron-left' size={config.iconSize} color={colors.darkBlueGray} />
            </Pressable>
          </View>
          <View
            style={{
              flex: 3,
              justifyContent: 'center',
            }}
          >
            <Text style={[{ color: colors.darkBlueGray, fontSize: 14, fontWeight: 'bold', textAlign: 'center' }]}>{headerText}</Text>
          </View>

          <View
            style={{
              flex: 1,
            }}
          ></View>
        </>
      ) : !withProfile ? (
        <View
          style={{
            flex: 3,
            justifyContent: 'center',
          }}
        >
          <Text style={[{ color: colors.darkBlueGray, fontSize: 14, fontWeight: 'bold', textAlign: 'center' }]}>{headerText}</Text>
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
            <Image source={{ uri: config.defaultAvatarUrl }} resizeMode='contain' style={{ width: 36, height: 36, borderRadius: 99 }} />
          </Pressable>

          <View
            style={{
              flex: 6,
              paddingLeft: 20,
            }}
          >
            <View
              style={{
                justifyContent: 'flex-end',
                flex: 1,
              }}
            >
              <Text style={[{ color: colors.darkBlueGray, fontSize: 14, fontWeight: 'bold' }]}>
                {isSocialSignIn ? t('user') : username}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text style={[{ color: colors.darkBlueGray, fontSize: 12 }]}></Text>
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
