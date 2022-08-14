import { Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging'

// Your secondary Firebase project credentials for Android...
const androidCredentials = {
  appId: '1:51738943910:android:218f1d5c6d5f3d170aaf67',
  apiKey: '',
  projectId: 'fit-evo-dev',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '',
  authDomain: '',
}

// Your secondary Firebase project credentials for iOS...
const iosCredentials = {
  appId: '1:51738943910:ios:52ca7828e8f509f70aaf67',
  apiKey: '',
  projectId: 'fit-evo-dev',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '',
  authDomain: '',
}

// Select the relevant credentials
export const credentials: any = Platform.select({
  android: androidCredentials,
  ios: iosCredentials,
})

export const getFcmToken = async () => {
  const fcmToken = await messaging().getToken()
  if (fcmToken) {
    console.log('Firebase Token:', fcmToken)
  } else {
    console.log('Failed', 'No token received')
  }
}
