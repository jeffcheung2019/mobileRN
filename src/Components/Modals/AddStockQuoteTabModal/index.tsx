import React, { FC, forwardRef, useRef, useState } from 'react'
import { View, ViewStyle, TextStyle, Pressable, Text, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Spacing } from '@/Theme/Variables'
import { useTheme } from '@/Hooks'
import { colors, elevationStyle } from '@/Utils/constants'
import ModalBox, { ModalProps } from 'react-native-modalbox'
import BrightGrayInput from '@/Components/Inputs/BrightGrayInput'

interface AddStockQuoteModalProps extends ModalProps {
  onModalClose: () => void
  style?: object
}

const MODAL_INPUT_VIEW: ViewStyle = {
  paddingHorizontal: 20,
  justifyContent: 'center',
  alignItems: 'center',
}

const AddStockQuoteModal = forwardRef<ModalBox, AddStockQuoteModalProps>((props, ref) => {
  const { onModalClose, style } = props
  const { t } = useTranslation()
  const [tabName, setTabName] = useState('')
  const element = useRef<ModalBox>(null)

  const onTabNameValueChange = (text: string) => {
    setTabName(text)
  }

  const onConfirmPress = () => {
    // ref?.current?.close()
    // element.current?.close()
  }

  const onCancelPress = () => {
    ref?.current?.close()
  }

  return (
    <ModalBox
      ref={ref}
      backdropPressToClose={false}
      position='center'
      entry='bottom'
      backdrop={true}
      backButtonClose={false}
      isOpen={true}
      onClosed={onModalClose}
      keyboardTopOffset={40}
      animationDuration={500}
      swipeToClose={false}
      style={{
        height: 200,
        backgroundColor: colors.white,
        borderRadius: 10,
        width: '80%',
        justifyContent: 'center',
        ...elevationStyle,
        ...style,
      }}
    >
      <View
        style={[
          MODAL_INPUT_VIEW,
          {
            flexBasis: 60,
          },
        ]}
      >
        <Text
          style={{
            color: colors.darkBlueGray,
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {t('startSettingUpWatchListTab')}
        </Text>
      </View>

      <View
        style={[
          MODAL_INPUT_VIEW,
          {
            flexBasis: 90,
          },
        ]}
      >
        <BrightGrayInput
          value={tabName}
          onChangeText={onTabNameValueChange}
          textInputProps={{
            placeholder: t('tabName'),
          }}
        />
      </View>

      <View
        style={{
          flexBasis: 50,
          flexDirection: 'row',
          padding: 10,
        }}
      >
        <Pressable
          onPress={onConfirmPress}
          style={({ pressed }) => {
            return {
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: colors.darkBlueGray,
              borderRadius: 10,
              opacity: pressed ? 0.5 : 1,
            }
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: colors.white,
              textAlign: 'center',
            }}
          >
            {t('confirm')}
          </Text>
        </Pressable>
        <Pressable
          onPress={onCancelPress}
          style={({ pressed }) => {
            return {
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              opacity: pressed ? 0.5 : 1,
            }
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: colors.darkBlueGray,
              textAlign: 'center',
            }}
          >
            {t('cancel')}
          </Text>
        </Pressable>
      </View>
    </ModalBox>
  )
})

export default AddStockQuoteModal
