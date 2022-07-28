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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { MainStackNavigatorParamList, MainStackNavigtorProps } from '@/Navigators/MainStackNavigator'
import { SettingScreenNavigationProps, SettingScreenNavigatorParamList } from '../SettingScreen'
import { awsLogout } from '@/Utils/helpers'
import { Icon } from '@rneui/base'
import StandardInput from '@/Components/Inputs/StandardInput'
import { formField } from 'aws-amplify'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export type SettingEditProfileScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<SettingScreenNavigatorParamList, RouteStacks.settingMain>,
  SettingScreenNavigationProps
>

const SettingEditProfileScreen: FC<SettingEditProfileScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [profileDtl, setProfileDtl] = useState({
    username: "",
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
      ...
    })
  }

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
          <StandardInput
            onChangeText={text => onFormFieldChange('username', text)}
            value={profileDtl.username}
            placeholder={t('username')}
            placeholderTextColor={colors.spanishGray}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default SettingEditProfileScreen
