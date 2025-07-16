import {
    FETCH_INVENTORY_REQUEST,
    FETCH_INVENTORY_SUCCESS,
    FETCH_INVENTORY_ERROR,
} from './ActionType';
import type { AnyAction } from 'redux';

interface InventoryItem {
    id: number;
    item: {
        id: number;
        name: string;
        rarity: string;
    };
    obtained_at: string;
}

export interface InventoryState {
    list: InventoryItem[];
    loading: boolean;
    error: string | null;
}

const initialState: InventoryState = {
    list: [],
    loading: false,
    error: null,
};

export const inventoryReducer = (
    state: InventoryState = initialState,
    action: AnyAction
): InventoryState => {
    switch (action.type) {
        case FETCH_INVENTORY_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_INVENTORY_SUCCESS:
            return { ...state, loading: false, list: action.payload };
        case FETCH_INVENTORY_ERROR:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
