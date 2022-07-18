import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
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
import TurquoiseButton from '@/Components/Buttons/TurquoiseButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { startLoading } from '@/Store/UI/actions'
import WhiteInput from '@/Components/Inputs/WhiteInput'
import StandardInput from '@/Components/Inputs/StandardInput'
import { emailUsernameHash } from '@/Utils/helpers'
import crashlytics from '@react-native-firebase/crashlytics'
import { Header } from '@/Components'

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

const CODE_FIELD_ROOT = {}

const CELL = {
  width: 50,
  height: 50,
  fontSize: 24,
  borderWidth: 1,
  borderColor: colors.spanishGray,
  color: colors.white,
  borderRadius: 10,
  textAlign: 'center',
  lineHeight: 48,
}

const FOCUSED_CELL = {}

const ForgotPasswordScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.validationCode>> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false)
  const [validationCode, setValidationCode] = useState('')
  const ref = useBlurOnFulfill({ value: validationCode, cellCount: 6 })
  const [errMsg, setErrMsg] = useState('')
  const [email, setEmail] = useState('')
  const [focusCellProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: validationCode,
    setValue: setValidationCode,
  })

  const goBack = () => {
    navigation.navigate(RouteStacks.logIn)
  }

  const onEmailChange = (text: string) => {
    setEmail(text)
  }

  const onConfirmPress = async () => {
    try {
      await Auth.forgotPassword(emailUsernameHash(email))
      navigation.navigate(RouteStacks.validationCode, {
        email: email,
        action: 'forgotPassword',
      })
    } catch (err: any) {
      crashlytics().recordError(err)
      setErrMsg(t('error.invalidEmail'))
    }
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.forgotPassword}>
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter]}>
        <Header onLeftPress={goBack} headerText={t('forgotPassword')} />
        <View
          style={[
            {
              flexGrow: 6,
            },
            Layout.fullWidth,
            Layout.fill,
            Layout.colCenter,
          ]}
        >
          <View style={[CONTENT_ELEMENT_WRAPPER, { flexBasis: 60 }]}>
            <Text style={[{ color: colors.white, fontWeight: 'bold', lineHeight: 26 }, Fonts.textSM, Fonts.textLeft]}>
              {t('forgotPasswordPrompt')}
            </Text>
          </View>

          <View style={[CONTENT_ELEMENT_WRAPPER, { flexBasis: 80, justifyContent: 'center' }]}>
            <StandardInput
              onChangeText={onEmailChange}
              value={email}
              placeholder={t('email')}
              placeholderTextColor={colors.spanishGray}
              autoCapitalize={'none'}
            />
            {errMsg !== '' && (
              <Text style={[{ color: colors.magicPotion, paddingHorizontal: 10 }, Fonts.textSM, Fonts.textLeft]}>{errMsg}</Text>
            )}
          </View>

          <View style={[CONTENT_ELEMENT_WRAPPER, { flex: 2, justifyContent: 'flex-start' }]}></View>
        </View>

        <View style={[Layout.fullWidth, Layout.center, { flex: 1, justifyContent: 'flex-start' }]}>
          <TurquoiseButton
            text={t('confirm')}
            onPress={onConfirmPress}
            containerStyle={{
              width: '45%',
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default ForgotPasswordScreen
