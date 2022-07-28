import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Header } from '@/Components'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
// @ts-ignore
import Amplify, { Auth } from 'aws-amplify'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { AuthNavigatorParamList } from '@/Navigators/AuthNavigator'
import { RouteStacks } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import ActionButton from '@/Components/Buttons/ActionButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { startLoading } from '@/Store/UI/actions'
import WhiteInput from '@/Components/Inputs/WhiteInput'
import axios from 'axios'
import { emailUsernameHash, triggerSnackbar } from '@/Utils/helpers'
import successfullGif from '@/Assets/Images/Illustrations/successful.gif'
const TEXT_INPUT = {
  height: 40,
  color: 'yellow',
  borderWidth: 1,
  borderRadius: 10,
  borderColor: '#000',
}

const BUTTON_ICON = {
  width: 30,
}

const BUTTON_TEXT: TextStyle = {
  width: 100,
}

const CONTENT_ELEMENT_WRAPPER: ViewStyle = {
  justifyContent: 'center',
  padding: 2,
  width: '90%',
}

const RegistrationCompletedScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.registrationCompleted>> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [errMsg, setErrMsg] = useState('')

  const onDonePress = () => {
    navigation.navigate(RouteStacks.logIn)
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.registrationCompleted}>
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter]}>
        <Header
          // onLeftPress={goBack}
          headerText={t('completed')}
          withProfile={false}
        />
        <View
          style={[
            {
              flexGrow: 6,
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
            Layout.fullWidth,
            Layout.fill,
          ]}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Image
              source={successfullGif}
              style={{
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <View style={[CONTENT_ELEMENT_WRAPPER, { flexBasis: 60, alignItems: 'center', justifyContent: 'center' }]}>
              <Text
                style={[
                  { color: colors.darkBlueGray, textAlign: 'center', fontFamily: 'Poppins-Bold', fontStyle: 'italic', fontSize: 30 },
                  Fonts.textLeft,
                ]}
              >
                {t('congrats')}
              </Text>
            </View>

            <View style={[CONTENT_ELEMENT_WRAPPER, { flexBasis: 60, alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ color: colors.darkBlueGray }}>{t('registrationCompleted')}</Text>
            </View>
          </View>
        </View>

        <View style={[Layout.fullWidth, Layout.center, { flex: 1, justifyContent: 'flex-start' }]}>
          <ActionButton
            text={t('done')}
            onPress={onDonePress}
            containerStyle={{
              width: '45%',
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default RegistrationCompletedScreen
