import React, { FC } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, PressableProps, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import LinearGradient from 'react-native-linear-gradient'
import Animated, { FadeInDown, FadeOut, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

type ActionButtonProps = {
  text: string
  containerStyle?: object
  style?: object
  textStyle?: object
  onPress: () => void
  isLoading?: boolean
  leftIcon?: () => React.ReactNode
  rightIcon?: () => React.ReactNode
  isTransparentBg?: boolean
}

const DEFAULT_TEXT_STYLE: TextStyle = {
  fontSize: 16,
  fontWeight: 'bold',
}

const BUTTON_STYLE: ViewStyle = {
  // backgroundColor: colors.eucalyptus,
  width: '100%',
  height: 42,
  justifyContent: 'center',
}

const ActionButton = ({
  text,
  containerStyle,
  style,
  isTransparentBg,
  textStyle,
  onPress,
  isLoading,
  leftIcon,
  rightIcon,
}: ActionButtonProps) => {
  const { Layout, Images } = useTheme()

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
    <Animated.View
      entering={FadeInDown.duration(1000)}
      style={[
        {
          ...containerStyle,
          backgroundColor: isTransparentBg ? colors.white : colors.darkBlueGray,
          borderColor: isTransparentBg ? colors.darkBlueGray : colors.transparent,
          borderWidth: isTransparentBg ? 1 : 0,
          borderRadius: 20,
        },
        containerAnimatedStyle,
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
        style={[
          BUTTON_STYLE,
          {
            // backgroundColor: colors.eucalyptus,
            alignItems: 'center',
            ...style,
          },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator size='small' color={colors.darkBlueGray} />
        ) : (
          <View style={[Layout.rowCenter]}>
            {leftIcon && leftIcon()}
            <Text
              style={[
                DEFAULT_TEXT_STYLE,
                textStyle,
                {
                  textAlign: 'center',
                  color: isTransparentBg ? colors.darkBlueGray : colors.white,
                },
              ]}
            >
              {text}
            </Text>
            {rightIcon && rightIcon()}
          </View>
        )}
      </Pressable>
    </Animated.View>
  )
}

ActionButton.defaultProps = {}

export default ActionButton
