import {
    FETCH_CASES_REQUEST,
    FETCH_CASES_SUCCESS,
    FETCH_CASES_ERROR,
    OPEN_CASE_REQUEST,
    OPEN_CASE_SUCCESS,
    OPEN_CASE_ERROR,
} from './ActionType';
import type { AnyAction } from 'redux';

interface CaseItem { id: number; name: string; rarity: string; }
interface Case     { id: number; name: string; description: string; price: number; items: CaseItem[]; }
interface OpenCaseResult { item: CaseItem; balance: number; }

export interface CasesState {
    list: Case[];
    loading: boolean;
    error: string | null;
    opening: boolean;
    openError: string | null;
    lastOpened?: OpenCaseResult;
}

const initialState: CasesState = {
    list: [],
    loading: false,
    error: null,
    opening: false,
    openError: null,
    lastOpened: undefined,
};

export const casesReducer = (
    state: CasesState = initialState,
    action: AnyAction
): CasesState => {
    switch (action.type) {
        case FETCH_CASES_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_CASES_SUCCESS:
            return { ...state, loading: false, list: action.payload };
        case FETCH_CASES_ERROR:
            return { ...state, loading: false, error: action.payload };

        case OPEN_CASE_REQUEST:
            return { ...state, opening: true, openError: null };
        case OPEN_CASE_SUCCESS:
            return {
                ...state,
                opening: false,
                lastOpened: action.payload,
            };
        case OPEN_CASE_ERROR:
            return { ...state, opening: false, openError: action.payload };

        default:
            return state;
    }
};
