import { RootState, store } from '@/Store'
import { showSnackbar, startLoading } from '@/Store/UI/actions'
import { logout } from '@/Store/Users/actions'
// @ts-ignore
import { Auth } from 'aws-amplify'
import axios, { AxiosRequestConfig } from 'axios'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { useSelector } from 'react-redux'
import crashlytics from '@react-native-firebase/crashlytics'

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
}

let showSnackbarTimeout: NodeJS.Timeout
export const triggerSnackbar = (textMsg: string, autoHidingTime = 1500) => {
  let snackBarConfig = {
    visible: true,
    textMessage: textMsg,
    autoHidingTime,
  }
  const { ui } = store.getState()
  const stateSnackBarConfig = ui.snackBarConfig
  if (!stateSnackBarConfig.visible) {
    clearTimeout(showSnackbarTimeout)
  }
  store.dispatch(showSnackbar(snackBarConfig))

  showSnackbarTimeout = setTimeout(() => {
    store.dispatch(
      showSnackbar({
        visible: false,
        textMessage: '',
        autoHidingTime,
      }),
    )
  }, autoHidingTime)
}

export const awsLogout = async () => {
  try {
    store.dispatch(startLoading(true))
    await Auth.signOut()
  } catch (err: any) {
    //crashlytics().recordError(err)
  } finally {
    store.dispatch(logout())
    store.dispatch(startLoading(false))
    await InAppBrowser.closeAuth()
  }
}

export const emailUsernameHash = (email: string) => `Cognito_${email.toLowerCase()}`

export const moneyConvertToKMB = (value: number) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(value)) >= 1.0e9
    ? (Math.abs(Number(value)) / 1.0e9).toFixed(2) + 'B'
    : // Six Zeroes for Millions
    Math.abs(Number(value)) >= 1.0e6
    ? (Math.abs(Number(value)) / 1.0e6).toFixed(2) + 'M'
    : // Three Zeroes for Thousands
    Math.abs(Number(value)) >= 1.0e3
    ? (Math.abs(Number(value)) / 1.0e3).toFixed(2) + 'K'
    : Math.abs(Number(value))
}
