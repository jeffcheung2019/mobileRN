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

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const SETTING_BUTTON_PRESSABLE_VIEW: ViewStyle = {
  paddingHorizontal: 10,
  paddingVertical: 20,
  width: '50%',
}

const SETTING_BUTTON_PRESSABLE: ViewStyle = {
  flexDirection: 'row',
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderColor: colors.brightGray,
  borderRadius: 10,
  borderWidth: 1,
}

const SETTING_BUTTON_TEXT_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingLeft: 20,
}

const SETTING_BUTTON_TEXT = {
  color: colors.darkBlueGray,
  fontSize: 12,
}

export type SettingMainScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<SettingScreenNavigatorParamList, RouteStacks.settingMain>,
  SettingScreenNavigationProps
>

const SettingMainScreen: FC<SettingMainScreenNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const params = route!.params || { username: null }

  const onEditAccountDtlPress = () => {}

  const onBackPress = () => {
    navigation.goBack()
    // navigation.navigate(RouteStacks.mainTab)
  }

  const onLogoutPress = async () => {
    await awsLogout()
  }

  const onSubscriptionPress = async () => {}

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
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              source={{ uri: config.defaultAvatarUrl }}
              style={{
                height: 50,
                width: 50,
                resizeMode: 'contain',
                borderRadius: 99,
                backgroundColor: colors.white,
              }}
            />
          </View>

          <ScrollView
            style={{
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: windowHeight - 240,
              width: '100%',
              backgroundColor: colors.white,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={SETTING_BUTTON_PRESSABLE_VIEW}>
                <Pressable onPress={onEditAccountDtlPress} style={SETTING_BUTTON_PRESSABLE}>
                  <View
                    style={{
                      backgroundColor: colors.white,
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons size={20} name='account-edit' color={colors.darkBlueGray} />
                  </View>
                  <View style={SETTING_BUTTON_TEXT_VIEW}>
                    <Text style={SETTING_BUTTON_TEXT}>Edit Profile</Text>
                  </View>
                </Pressable>
              </View>

              <View style={SETTING_BUTTON_PRESSABLE_VIEW}>
                <Pressable onPress={onSubscriptionPress} style={SETTING_BUTTON_PRESSABLE}>
                  <View
                    style={{
                      backgroundColor: colors.white,
                      width: 30,
                      height: 30,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialIcons size={20} name='payment' color={colors.darkBlueGray} />
                  </View>
                  <View style={SETTING_BUTTON_TEXT_VIEW}>
                    <Text style={SETTING_BUTTON_TEXT}>Subscription</Text>
                  </View>
                </Pressable>
              </View>
            </View>

            <Pressable onPress={onLogoutPress} style={SETTING_BUTTON_PRESSABLE}>
              <View
                style={{
                  backgroundColor: colors.white,
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon size={config.iconSize} type='materialicons' name='logout' color={colors.darkBlueGray} />
              </View>
              <View style={SETTING_BUTTON_TEXT_VIEW}>
                <Text style={SETTING_BUTTON_TEXT}>Logout</Text>
              </View>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default SettingMainScreen
