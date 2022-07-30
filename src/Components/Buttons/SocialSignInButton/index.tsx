import React, { FC } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, PressableProps, ViewStyle, ImageSourcePropType } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import facebookIcon from '@/Assets/Images/icons/facebook.png'
import appleIcon from '@/Assets/Images/icons/apple.png'
import googleIcon from '@/Assets/Images/icons/google.png'
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

type SocialSignInButtonProps = {
  containerStyle?: object
  style?: object
  textStyle?: object
  onPress: () => void
  isLoading?: boolean
  iconName: 'google' | 'apple' | 'facebook'
}

let size = 30

const BUTTON_STYLE: ViewStyle = {
  backgroundColor: colors.darkBlueGray,
  height: size,
  width: size,
  borderRadius: 99,
  justifyContent: 'center',
}

const iconNameMap = {
  facebook: facebookIcon,
  apple: appleIcon,
  google: googleIcon,
}

const SocialSignInButton = ({ containerStyle, style, textStyle, onPress, isLoading, iconName }: SocialSignInButtonProps) => {
  const { Layout, Images } = useTheme()

  const styleSharedVal = useSharedValue({
    scale: 1,
    opacity: 1,
  })

  const animatedViewStyle = useAnimatedStyle(() => {
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
    <Animated.View
      entering={FadeInDown.duration(1000)}
      style={[
        {
          ...containerStyle,
        },
        animatedViewStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          styleSharedVal.value = {
            scale: 0.95,
            opacity: 0.7,
          }
        }}
        onPressOut={() => {
          styleSharedVal.value = {
            scale: 1,
            opacity: 1,
          }
        }}
        style={[BUTTON_STYLE, {}]}
      >
        {isLoading ? (
          <ActivityIndicator size='small' color={colors.white} />
        ) : (
          <View style={[Layout.rowCenter, {}]}>
            <Image source={iconNameMap[iconName]} style={{ width: size, height: size }} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  )
}

SocialSignInButton.defaultProps = {}

export default SocialSignInButton
