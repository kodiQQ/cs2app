import { Dispatch } from 'redux';
import { fetchWithAuth } from '../../api/apiClient';
import {
    FETCH_CASES_REQUEST,
    FETCH_CASES_SUCCESS,
    FETCH_CASES_ERROR, OPEN_CASE_REQUEST, OPEN_CASE_SUCCESS, OPEN_CASE_ERROR,
} from './ActionType';

interface Case {
    id: number;
    name: string;
    description: string;
    price: number;
    items: Array<{ id: number; name: string; rarity: string }>;
}

interface OpenCaseResult {
    item: { id: number; name: string; rarity: string };
    balance: number;
}

const fetchCasesRequest = () => ({ type: FETCH_CASES_REQUEST });
const fetchCasesSuccess = (payload: Case[]) => ({ type: FETCH_CASES_SUCCESS, payload });
const fetchCasesError   = (error: string) => ({ type: FETCH_CASES_ERROR, payload: error });

const openCaseRequest = () => ({ type: OPEN_CASE_REQUEST });
const openCaseSuccess = (payload: OpenCaseResult) => ({ type: OPEN_CASE_SUCCESS, payload });
const openCaseError   = (error: string) => ({ type: OPEN_CASE_ERROR, payload: error });

export const fetchCases = () => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchCasesRequest());
        try {
            const data = await fetchWithAuth('/cases/', { method: 'GET' }, 'fetchCases');
            if ((data as any).error) {
                dispatch(fetchCasesError((data as any).message));
            } else {
                dispatch(fetchCasesSuccess(data as Case[]));
            }
        } catch (err: any) {
            dispatch(fetchCasesError(err.message));
        }
    };
};

export const openCase = (caseId: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(openCaseRequest());
        try {
            const data = await fetchWithAuth(
                `/cases/${caseId}/open/`,
                { method: 'POST' },
                'openCase'
            );
            if ((data as any).error) {
                dispatch(openCaseError((data as any).message));
            } else {
                dispatch(openCaseSuccess(data as OpenCaseResult));
            }
        } catch (err: any) {
            dispatch(openCaseError(err.message));
        }
    };
};
