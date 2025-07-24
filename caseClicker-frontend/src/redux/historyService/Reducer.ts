import {
    FETCH_HISTORY_REQUEST,
    FETCH_HISTORY_SUCCESS,
    FETCH_HISTORY_ERROR,
} from './ActionType';

import type {HistoryItem} from "./Action.ts";
import type {AnyAction} from "redux";


interface HistoryState {
    items: HistoryItem[];
    loading: boolean;
    error: string | null;
}

const initialState: HistoryState = {
    items: [],
    loading: false,
    error: null,
};

export const historyReducer = (
    state = initialState,
    action: AnyAction
): HistoryState => {
    switch (action.type) {
        case FETCH_HISTORY_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_HISTORY_SUCCESS:
            return { ...state, loading: false, items: action.payload };
        case FETCH_HISTORY_ERROR:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
