import React, { useState, useEffect, useCallback, FC } from 'react'
import { View, Text, ScrollView, TextStyle, Alert, ViewStyle, Pressable, Image, Dimensions, PressableProps } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { changeTheme, ThemeState } from '@/Store/Theme'
import { login } from '@/Store/Users/actions'
import { UserState } from '@/Store/Users/reducer'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { colors, config } from '@/Utils/constants'
import { RouteStacks } from '@/Navigators/routes'
import ScreenBackgrounds from '@/Components/ScreenBackgrounds'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ActionButton from '@/Components/Buttons/ActionButton'
import { Header } from '@/Components'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { MainStackNavigatorParamList, MainTabNavigatorScreenProps } from '@/Navigators/MainStackNavigator'
import { SettingScreenProps, SettingScreenNavigatorParamList } from '../SettingScreen'
import { awsLogout } from '@/Utils/helpers'
import { Icon } from '@rneui/base'
import StandardInput from '@/Components/Inputs/StandardInput'
import { formField } from 'aws-amplify'
import BrightGrayInput from '@/Components/Inputs/BrightGrayInput'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export type SettingEditProfileScreenProps = CompositeScreenProps<
  StackScreenProps<SettingScreenNavigatorParamList, RouteStacks.settingMain>,
  SettingScreenProps
>

const SETTING_SECTION_VIEW: ViewStyle = {
  flexBasis: 60,
  paddingHorizontal: 20,
  justifyContent: 'center',
  width: '100%',
}

const SETTING_ACTION_BUTTON: PressableProps = {}

const SettingEditProfileScreen: FC<SettingEditProfileScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [profileDtl, setProfileDtl] = useState({
    username: '',
    password: '',
    newPassword: '',
  })

  const onEditAccountDtlPress = () => {}

  const onBackPress = () => {
    navigation.goBack()
    // navigation.navigate(RouteStacks.mainTab)
  }

  const onLogoutPress = async () => {
    await awsLogout()
  }

  const onSubscriptionPress = async () => {}

  const onFormFieldChange = (formField: string, text: string) => {
    setProfileDtl({
      ...profileDtl,
      [formField]: text,
    })
  }

  const onUpdateProfilePress = () => {}

  const onUpdatePasswordPress = () => {}

  return (
    <ScreenBackgrounds screenName={RouteStacks.setting}>
      <Header leftIcon={() => <Ionicons size={22} name='list' />} onLeftPress={onBackPress} headerText={t('setting')} withProfile={false} />
      <KeyboardAwareScrollView contentContainerStyle={[Layout.fill, Layout.colCenter]}>
        <View
          style={[
            Layout.fullSize,
            {
              alignItems: 'center',
              width: '100%',
              flex: 1,
              justifyContent: 'flex-start',
            },
          ]}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexBasis: 100,
            }}
          >
            <Image
              source={{
                uri: config.defaultAvatarUrl,
              }}
              style={{
                borderRadius: 99,
                width: 50,
                height: 50,
                resizeMode: 'contain',
              }}
            />
          </View>

          <View style={[SETTING_SECTION_VIEW]}>
            <BrightGrayInput
              onChangeText={text => onFormFieldChange('username', text)}
              icon={() => <FontAwesome5 name='user' size={20} color={colors.darkBlueGray} />}
              value={profileDtl.username}
              textInputProps={{
                placeholder: t('username'),
                placeholderTextColor: colors.spanishGray,
              }}
            />
          </View>

          <View style={[SETTING_SECTION_VIEW]}>
            <ActionButton text={t('updateProfile')} onPress={onUpdateProfilePress} />
          </View>

          <View style={[SETTING_SECTION_VIEW]}>
            <BrightGrayInput
              onChangeText={text => onFormFieldChange('oldPassword', text)}
              icon={() => <MaterialCommunityIcons name='key' size={20} color={colors.darkBlueGray} />}
              value={profileDtl.password}
              textInputProps={{
                placeholder: t('oldPassword'),
                placeholderTextColor: colors.spanishGray,
              }}
            />
          </View>

          <View style={[SETTING_SECTION_VIEW]}>
            <BrightGrayInput
              onChangeText={text => onFormFieldChange('newPassword', text)}
              icon={() => <MaterialCommunityIcons name='key' size={20} color={colors.darkBlueGray} />}
              value={profileDtl.newPassword}
              textInputProps={{
                placeholder: t('newPassword'),
                placeholderTextColor: colors.spanishGray,
              }}
            />
          </View>

          <View style={[SETTING_SECTION_VIEW]}>
            <ActionButton text={t('updatePassword')} onPress={onUpdatePasswordPress} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default SettingEditProfileScreen
