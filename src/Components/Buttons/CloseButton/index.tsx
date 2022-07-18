import React, { FC } from 'react'
import { View, Image, Text, ActivityIndicator, Pressable, PressableProps, ViewStyle, ImageSourcePropType } from 'react-native'
import { useTheme } from '@/Hooks'
import { colors } from '@/Utils/constants'
import facebookIcon from '@/Assets/Images/buttons/facebook.png'
import closeIcon from '@/Assets/Images/buttons/btn_cross_2.png'
import { Icon } from 'react-native-vector-icons/Icon'

type CloseButtonProps = {
  containerStyle?: object
  style?: object
  textStyle?: object
  onPress: () => void
  isLoading?: boolean
}

let size = 30

const BUTTON_STYLE: ViewStyle = {
  // backgroundColor: colors.eucalyptus,
  height: 50,
  width: 50,
  borderRadius: 99,
  // justifyContent: 'center',
}

const iconNameMap = {
  close: closeIcon,
}
const CloseButton = ({ containerStyle, onPress, isLoading }: CloseButtonProps) => {
  const { Layout, Images } = useTheme()

  return (
    <View style={[containerStyle]}>
      <Pressable onPress={onPress} style={[BUTTON_STYLE, {}]}>
        {isLoading ? (
          <ActivityIndicator size='small' color={'#fff'} />
        ) : (
          <View>
            <Image source={iconNameMap.close} style={{ width: 50, height: 50 }} />
          </View>
        )}
      </Pressable>
    </View>
  )
}

CloseButton.defaultProps = {}

export default CloseButton
