import { createReducer } from '@reduxjs/toolkit'
import { storeReferralCode } from './actions'


export type ReferralState = {
    referralCode: string,
}

const initialState: ReferralState = {
    referralCode: "",
}

export default createReducer<ReferralState>(initialState, (builder) => {
    builder
        .addCase(storeReferralCode, (state, action) => {
            return {
                ...state,
                referralCode: action.payload
            }
        })
})