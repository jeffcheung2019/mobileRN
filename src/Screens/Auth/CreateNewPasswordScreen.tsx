import React, { useState, useEffect, useCallback, FC } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, ActivityIndicator, Text, TextInput, Pressable, ScrollView, TextStyle, Alert, ViewStyle, Image } from 'react-native'
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
import ActionButton from '@/Components/Buttons/ActionButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { startLoading } from '@/Store/UI/actions'
import WhiteInput from '@/Components/Inputs/WhiteInput'
import StandardInput from '@/Components/Inputs/StandardInput'
import { emailUsernameHash } from '@/Utils/helpers'
import { Header } from '@/Components'
import newPasswordGif from '@/Assets/Images/Illustrations/newPassword.gif'

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
  paddingHorizontal: 30,
  width: '100%',
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

const CreateNewPasswordScreen: FC<StackScreenProps<AuthNavigatorParamList, RouteStacks.createNewPassword>> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const params = route!.params || { validationCode: '', username: '' }
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false)
  const [validationCode, setValidationCode] = useState('')
  const ref = useBlurOnFulfill({ value: validationCode, cellCount: 6 })
  const [errMsg, setErrMsg] = useState('')
  const [username, setUsername] = useState('')
  const [credential, setCredential] = useState({
    password: '',
    confirmPassword: '',
  })

  const goBack = () => {
    navigation.goBack()
  }

  const onCredentialChange = (text: string, fieldName: string) => {
    setCredential({
      ...credential,
      [fieldName]: text,
    })
  }

  const onConfirmPress = async () => {
    if (credential.password !== credential.confirmPassword) {
      setErrMsg(t('error.passwordMismatch'))
    }
    try {
      await Auth.forgotPasswordSubmit(emailUsernameHash(params.email), params.validationCode, credential.confirmPassword)
      navigation.navigate(RouteStacks.logIn)
    } catch (err: any) {
      switch (err.message) {
        case 'Invalid verification code provided, please try again.':
          setErrMsg(err.message)
          break
        default:
          setErrMsg(t('error.passwordPolicyErr'))
          break
      }
    }
  }

  return (
    <ScreenBackgrounds screenName={RouteStacks.createNewPassword}>
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter]}>
        <Header onLeftPress={goBack} headerText={t('createNewPassword')} withProfile={false} />
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
          <View
            style={{
              flex: 4,
            }}
          >
            <Image
              source={newPasswordGif}
              style={{
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>
          <View
            style={{
              flex: 5,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <View style={[CONTENT_ELEMENT_WRAPPER, { flexBasis: 80, justifyContent: 'center' }]}>
              <StandardInput
                onChangeText={text => onCredentialChange(text, 'password')}
                value={credential.password}
                placeholder={t('newPassword')}
                placeholderTextColor={colors.spanishGray}
                secureTextEntry={true}
              />
            </View>

            <View style={[CONTENT_ELEMENT_WRAPPER, { flexBasis: 80, justifyContent: 'center' }]}>
              <StandardInput
                onChangeText={text => onCredentialChange(text, 'confirmPassword')}
                value={credential.confirmPassword}
                placeholder={t('confirmPassword')}
                placeholderTextColor={colors.spanishGray}
                secureTextEntry={true}
              />
              {errMsg !== '' && (
                <Text style={[{ color: colors.magicPotion, paddingHorizontal: 10 }, Fonts.textSM, Fonts.textLeft]}>{errMsg}</Text>
              )}
            </View>

            <View style={[Layout.fullWidth, Layout.center, { paddingHorizontal: 30, flex: 1, justifyContent: 'center' }]}>
              <ActionButton
                text={t('confirm')}
                onPress={onConfirmPress}
                containerStyle={{
                  width: '100%',
                }}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default CreateNewPasswordScreen
