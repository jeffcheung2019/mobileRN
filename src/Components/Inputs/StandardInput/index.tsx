import React, { FC } from 'react'
import { View, Image, Text, TextInput, StyleProp, ViewStyle, ImageStyle, TextInputProps, Pressable } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import appLogo from '@/Assets/Images/logos/logo.png'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface StandardInputProps extends TextInputProps {
  containerStyle?: object
  onPasswordEyePress?: () => void
  showPassword?: boolean
}

const StandardInput = (props: StandardInputProps) => {
  const { Layout, Images } = useTheme()

  const { containerStyle, style, onChangeText, value, placeholder, placeholderTextColor, onPasswordEyePress, showPassword } = props

  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        ...containerStyle,
      }}
    >
      <TextInput
        {...props}
        style={{
          width: '100%',
          borderBottomWidth: 1,
          borderColor: colors.darkCharcoal,
          paddingHorizontal: 6,
          paddingVertical: 10,
          color: colors.darkCharcoal,
          ...(style as object),
        }}
      />
      {onPasswordEyePress && (
        <View style={{ position: 'absolute', right: 10, bottom: 0, justifyContent: 'center', height: '100%' }}>
          <Pressable onPress={onPasswordEyePress}>
            {showPassword ? (
              <MaterialCommunityIcons name='eye-outline' color={colors.white} size={20} />
            ) : (
              <MaterialCommunityIcons name='eye-off-outline' color={colors.white} size={20} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  )
}

StandardInput.defaultProps = {}

export default StandardInput
