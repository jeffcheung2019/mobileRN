import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import { showSnackbar, ShowSnackbarPayload, startLoading } from './actions'


export type UIState = {
    isScreenLoading: boolean,
    snackBarConfig: {
        visible: boolean,
        textMessage: string,
        position: 'top' | 'bottom',
        actionText: string,
        autoHidingTime: number
    },
}

const initialState: UIState = {
    isScreenLoading: true,
    snackBarConfig: {
        visible: false,
        textMessage: "",
        position: "top",
        actionText: "OK",
        autoHidingTime: 30000
    },
}

export default createReducer<UIState>(initialState, (builder) => {
    builder
        .addCase(startLoading, (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                isScreenLoading: action.payload
            }
        })
        .addCase(showSnackbar, (state, action
             : PayloadAction<ShowSnackbarPayload>
             ) => {
            return {
                ...state,
                snackBarConfig: {
                    visible: action.payload.visible ?? false,
                    textMessage: action.payload.textMessage ?? "",
                    position: action.payload.position ?? "top",
                    actionText: action.payload.actionText ?? "OK",
                    autoHidingTime: action.payload.autoHidingTime ?? 30000
                }
            }
        })
})