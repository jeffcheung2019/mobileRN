import { createAction } from '@reduxjs/toolkit'

export type LoginPayload = {
  username: string
  email: string
}

export type StoreInvitationCodePayload = {
  invitationCode: string
}
export type FCMTokenPayload = {
  fcmToken: string
}

export const login = createAction<LoginPayload>('user/login')
export const logout = createAction('user/logout')
export const storeInvitationCode = createAction<StoreInvitationCodePayload>('user/storeInvitationCode')
export const updateFCMToken = createAction<string>('user/updateFCMToken')
