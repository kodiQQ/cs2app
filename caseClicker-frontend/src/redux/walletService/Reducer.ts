import {
    FETCH_WALLET_REQUEST,
    FETCH_WALLET_SUCCESS,
    FETCH_WALLET_ERROR,
    TOPUP_WALLET_REQUEST,
    TOPUP_WALLET_SUCCESS,
    TOPUP_WALLET_ERROR,
} from './ActionType';
import type { AnyAction } from 'redux';

export interface WalletState {
    balance: number;
    loading: boolean;
    error: string | null;
}

const initialState: WalletState = {
    balance: 0,
    loading: false,
    error: null,
};

export const walletReducer = (
    state: WalletState = initialState,
    action: AnyAction
): WalletState => {
    switch (action.type) {
        case FETCH_WALLET_REQUEST:
        case TOPUP_WALLET_REQUEST:
            return { ...state, loading: true, error: null };

        case FETCH_WALLET_SUCCESS:
        case TOPUP_WALLET_SUCCESS:
            return { ...state, loading: false, balance: action.payload };

        case FETCH_WALLET_ERROR:
        case TOPUP_WALLET_ERROR:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
