import { PayloadAction, createReducer } from '@reduxjs/toolkit'
import { FCMTokenPayload, login, LoginPayload, logout, storeInvitationCode, StoreInvitationCodePayload, updateFCMToken } from './actions'

export type UserState = {
  isLoggedIn: boolean
  username: string
  email: string
  cognitoUser: any
  uuid: string
  fcmToken: string
}

const initialState: UserState = {
  isLoggedIn: false,
  username: '',
  email: '',
  cognitoUser: null,
  uuid: '',
  fcmToken: '',
}

export default createReducer<UserState>(initialState, builder => {
  builder
    .addCase(login, (state, action: PayloadAction<LoginPayload>) => {
      return {
        ...state,
        isLoggedIn: true,
        ...action.payload,
      }
    })
    .addCase(logout, state => {
      return {
        ...state,
        isLoggedIn: false,
        username: '',
        email: '',
        cognitoUser: null,
        uuid: '',
      }
    })
    .addCase(updateFCMToken, (state, action: PayloadAction<string>) => {
      return {
        ...state,
        fcmToken: action.payload,
      }
    })
})
