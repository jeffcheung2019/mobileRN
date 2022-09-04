import { initStockInfoShowSection, StockInfoShowSection } from '@/Screens/App/StockInfo/MainScreen'
import { createSlice, PayloadAction, PayloadActionCreator } from '@reduxjs/toolkit'
import { StockInfoDisplayState } from '../StockInfoDisplay/reducer'

export type ShowSnackbarPayload = {
  visible: boolean
  textMessage: string
  position?: 'top' | 'bottom'
  actionText?: string
  autoHidingTime?: number
}

export type UIState = {
  isScreenLoading: boolean
  snackBarConfig: {
    visible: boolean
    textMessage: string
    position: 'top' | 'bottom'
    actionText: string
    autoHidingTime: number
  }
  tabBarVisible: boolean
  stockInfoShowSection: StockInfoShowSection
}

const initialState: UIState = {
  isScreenLoading: true,
  snackBarConfig: {
    visible: false,
    textMessage: '',
    position: 'top',
    actionText: 'OK',
    autoHidingTime: 30000,
  },
  tabBarVisible: true,
  stockInfoShowSection: {
    ...initStockInfoShowSection,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<boolean>) => {
      state.isScreenLoading = action.payload
    },
    showSnackbar: (state, action: PayloadAction<ShowSnackbarPayload>) => {
      state.snackBarConfig = {
        visible: action.payload.visible ?? false,
        textMessage: action.payload.textMessage ?? '',
        position: action.payload.position ?? 'top',
        actionText: action.payload.actionText ?? 'OK',
        autoHidingTime: action.payload.autoHidingTime ?? 30000,
      }
    },
    showTabBar: (state, action: PayloadAction<boolean>) => {
      state.tabBarVisible = action.payload
    },
    updateStockInfoShowSection: (state, action: PayloadAction<Partial<StockInfoShowSection>>) => {
      state.stockInfoShowSection = {
        ...state.stockInfoShowSection,
        ...action.payload,
      }
    },
  },
})

export const { startLoading, showSnackbar, showTabBar, updateStockInfoShowSection } = uiSlice.actions
export default uiSlice.reducer
