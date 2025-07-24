
import {
    FETCH_HISTORY_REQUEST,
    FETCH_HISTORY_SUCCESS,
    FETCH_HISTORY_ERROR,
} from './ActionType';
import {fetchWithAuth} from "../api.ts";
import type {Dispatch} from "redux";

export interface HistoryItem {
    id: number;
    item: {
        name: string;
        rarity: string;
    };
    opened_at: string;
}

const fetchHistoryRequest = () => ({ type: FETCH_HISTORY_REQUEST });
const fetchHistorySuccess = (history: HistoryItem[]) => ({
    type: FETCH_HISTORY_SUCCESS,
    payload: history,
});
const fetchHistoryError = (error: string) => ({
    type: FETCH_HISTORY_ERROR,
    payload: error,
});

export const fetchHistory = () => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchHistoryRequest());
        try {
            const data = await fetchWithAuth('/history/', { method: 'GET' }, 'fetchHistory');
            if ((data as any).error) {
                dispatch(fetchHistoryError((data as any).message));
            } else {
                dispatch(fetchHistorySuccess(data as HistoryItem[]));
            }
        } catch (err: any) {
            dispatch(fetchHistoryError(err.message));
        }
    };
};
