import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import { showSnackbar, ShowSnackbarPayload, startLoading } from './actions'

export type StockInfoDisplayState = {
  sectionShowDisplay: string[]
  fetched: boolean
}

const initialState: StockInfoDisplayState = {
  sectionShowDisplay: [],
  fetched: false,
}

export default createReducer<StockInfoDisplayState>(initialState, builder => {
  builder
    .addCase(startLoading, (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isScreenLoading: action.payload,
      }
    })
    .addCase(showSnackbar, (state, action: PayloadAction<ShowSnackbarPayload>) => {
      return {
        ...state,
        snackBarConfig: {
          visible: action.payload.visible ?? false,
          textMessage: action.payload.textMessage ?? '',
          position: action.payload.position ?? 'top',
          actionText: action.payload.actionText ?? 'OK',
          autoHidingTime: action.payload.autoHidingTime ?? 30000,
        },
      }
    })
})
