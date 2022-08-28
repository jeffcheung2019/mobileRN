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
import { MainStackNavigatorParamList, MainTabNavigatorScreenProps } from '@/Navigators/MainStackNavigator'
import { SettingScreenProps, SettingScreenNavigatorParamList } from '../SettingScreen'
import { awsLogout } from '@/Utils/helpers'
import { Icon } from '@rneui/base'
import { RootState } from '@/Store'
import SettingActionItem from '@/Screens/App/Setting/Components/SettingActionItem'
import { startLoading } from '@/Store/UI/actions'

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

const SETTING_ACTION_ITEM_VIEW: ViewStyle = {
  marginVertical: 4,
}

export type SettingMainScreenProps = CompositeScreenProps<
  StackScreenProps<SettingScreenNavigatorParamList, RouteStacks.settingMain>,
  SettingScreenProps
>

const SettingMainScreen: FC<SettingMainScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const { username } = useSelector((state: RootState) => state.user)

  const params = route!.params || { username: null }

  const onBackPress = () => {
    navigation.goBack()
  }

  const onLogoutPress = async () => {
    await awsLogout()
  }
  const onEditAccountDtlPress = () => {
    navigation.navigate(RouteStacks.settingEditProfile)
  }

  const onSubscriptionPress = async () => {}

  const onChangeLanguagePress = () => {}

  const onFeedbackPress = () => {}

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
              flexBasis: 140,
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 20,
            }}
          >
            <View style={{ flexBasis: 80, height: '100%', alignItems: 'center' }}>
              <Image
                source={{ uri: config.defaultAvatarUrl }}
                style={{
                  height: 80,
                  width: 80,
                  resizeMode: 'contain',
                  borderRadius: 99,
                  backgroundColor: colors.white,
                }}
              />
            </View>
            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: colors.darkBlueGray,
                  paddingHorizontal: 20,
                }}
                numberOfLines={1}
              >
                {username}
              </Text>
            </View>
          </View>

          <ScrollView
            style={{
              flex: 5,
              paddingHorizontal: 20,
              paddingVertical: 20,
              width: '100%',
            }}
          >
            <View style={SETTING_ACTION_ITEM_VIEW}>
              <SettingActionItem
                actionIcon={() => <MaterialCommunityIcons size={30} name='account-edit' color={colors.darkBlueGray} />}
                onActionItemPress={onEditAccountDtlPress}
                title={t('editProfile')}
                desc={t('editProfileDesc')}
              />
            </View>

            <View style={SETTING_ACTION_ITEM_VIEW}>
              <SettingActionItem
                actionIcon={() => <MaterialIcons size={30} name='language' color={colors.darkBlueGray} />}
                onActionItemPress={onChangeLanguagePress}
                title={t('changeLanguage')}
                desc={t('updateLanguageDesc')}
              />
            </View>

            <View style={SETTING_ACTION_ITEM_VIEW}>
              <SettingActionItem
                actionIcon={() => <MaterialIcons size={30} name='payment' color={colors.darkBlueGray} />}
                onActionItemPress={onSubscriptionPress}
                title={t('subscribe')}
                desc={t('subscribeDesc')}
              />
            </View>

            <View style={SETTING_ACTION_ITEM_VIEW}>
              <SettingActionItem
                actionIcon={() => <MaterialCommunityIcons size={30} name='comment-processing' color={colors.darkBlueGray} />}
                onActionItemPress={onFeedbackPress}
                title={t('feedback')}
                desc={t('feedbackDesc')}
              />
            </View>
          </ScrollView>

          <View style={{ flexBasis: 60, width: '100%', paddingHorizontal: 40 }}>
            <ActionButton onPress={onLogoutPress} text={t('logout')} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScreenBackgrounds>
  )
}

export default SettingMainScreen
