import type {Dispatch} from 'redux';
import {
    FETCH_WALLET_REQUEST,
    FETCH_WALLET_SUCCESS,
    FETCH_WALLET_ERROR,
    TOPUP_WALLET_REQUEST,
    TOPUP_WALLET_SUCCESS,
    TOPUP_WALLET_ERROR,
} from './ActionType';
import {fetchWithAuth} from "../api.ts";

const fetchWalletRequest = () => ({ type: FETCH_WALLET_REQUEST });
const fetchWalletSuccess = (balance: number) => ({
    type: FETCH_WALLET_SUCCESS,
    payload: balance,
});
const fetchWalletError = (error: string) => ({
    type: FETCH_WALLET_ERROR,
    payload: error,
});

const topupWalletRequest = () => ({ type: TOPUP_WALLET_REQUEST });
const topupWalletSuccess = (balance: number) => ({
    type: TOPUP_WALLET_SUCCESS,
    payload: balance,
});
const topupWalletError = (error: string) => ({
    type: TOPUP_WALLET_ERROR,
    payload: error,
});

export const fetchWallet = () => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchWalletRequest());
        try {
            const data = await fetchWithAuth(
                '/wallet/',
                { method: 'GET' },
                'fetchWallet'
            );
            if ((data as any).error) {
                dispatch(fetchWalletError((data as any).message));
            } else {
                dispatch(fetchWalletSuccess((data as any).balance));
            }
        } catch (err: any) {
            dispatch(fetchWalletError(err.message));
        }
    };
};

export const topUpWallet = (amount: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(topupWalletRequest());
        try {
            const data = await fetchWithAuth(
                '/wallet/topup/',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount }),
                },
                'topUpWallet'
            );
            if ((data as any).error) {
                dispatch(topupWalletError((data as any).message));
            } else {
                dispatch(topupWalletSuccess((data as any).balance));
            }
        } catch (err: any) {
            dispatch(topupWalletError(err.message));
        }
    };
};
