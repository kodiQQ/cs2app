import { applyMiddleware, combineReducers, legacy_createStore } from "redux"
import { thunk } from "redux-thunk"
import {authReducer} from "./authService/Reducer.ts";

const rootReducer = combineReducers({
    auth: authReducer,
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export type RootState = ReturnType<typeof rootReducer>;