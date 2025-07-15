import { applyMiddleware, combineReducers, legacy_createStore } from "redux"
import { thunk } from "redux-thunk"
import {authReducer} from "./authService/Reducer.ts";
import {casesReducer} from "./casesService/Reducer.ts";

const rootReducer = combineReducers({
    auth: authReducer,
    cases: casesReducer,
    // wallet: walletReducer,
    // inventory: inventoryReducer,
    // history: historyReducer,
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export type RootState = ReturnType<typeof rootReducer>;