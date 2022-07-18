import { createAction } from '@reduxjs/toolkit'
import { UIState } from './reducer'

export type ShowSnackbarPayload = {
    visible: boolean,
    textMessage: string,
    position?: 'top' | 'bottom',
    actionText?: string,
    autoHidingTime?: number
}

export const startLoading = createAction<boolean>('ui/startLoading')
export const showSnackbar = createAction<ShowSnackbarPayload>('ui/showSnackbar')
