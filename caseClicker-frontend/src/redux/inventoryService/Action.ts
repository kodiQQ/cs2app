import type {Dispatch} from 'redux';

import {
    FETCH_INVENTORY_REQUEST,
    FETCH_INVENTORY_SUCCESS,
    FETCH_INVENTORY_ERROR,
} from './ActionType';
import {fetchWithAuth} from "../api.ts";

interface InventoryItem {
    id: number;
    item: {
        id: number;
        name: string;
        rarity: string;
    };
    obtained_at: string;
}

const fetchInventoryRequest = () => ({ type: FETCH_INVENTORY_REQUEST });
const fetchInventorySuccess = (payload: InventoryItem[]) => ({
    type: FETCH_INVENTORY_SUCCESS,
    payload,
});
const fetchInventoryError = (error: string) => ({
    type: FETCH_INVENTORY_ERROR,
    payload: error,
});

export const fetchInventory = () => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchInventoryRequest());
        try {
            const data = await fetchWithAuth(
                '/inventory/',
                { method: 'GET' },
                'fetchInventory'
            );
            if ((data as any).error) {
                dispatch(fetchInventoryError((data as any).message));
            } else {
                dispatch(fetchInventorySuccess(data as InventoryItem[]));
            }
        } catch (err: any) {
            dispatch(fetchInventoryError(err.message));
        }
    };
};
