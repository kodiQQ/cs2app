// src/redux/AuthService/Action.ts
import { dispatchAction } from "../api";
import {
    LOGIN_ERROR,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_ERROR,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    REGISTER_ERROR,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REQUEST_USER,
    REQUEST_USER_ERROR,
    REQUEST_USER_SUCCESS,
} from "./ActionType.ts";
import type {Dispatch} from "redux";

interface AuthPayload {
    email: string;
    password: string;
    [key: string]: any;
}

export const registerAction = (data: AuthPayload) => async (dispatch: Dispatch) => {
    await dispatchAction(dispatch, REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_ERROR, "/auth/register/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const loginAction = (data: AuthPayload) => async (dispatch: Dispatch) => {
    await dispatchAction(dispatch, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR, "/auth/login/", {
        method: "POST",
        body: JSON.stringify({ username: data.email, password: data.password }),
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const logoutAction = () => async (dispatch: Dispatch) => {
    await dispatchAction(dispatch, LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_ERROR, "/auth/logout", {
        method: "POST",
        credentials: "include",
    });
};

export const currentUser = () => async (dispatch: Dispatch) => {
    await dispatchAction(dispatch, REQUEST_USER, REQUEST_USER_SUCCESS, REQUEST_USER_ERROR, "/auth/user/", {
        method: "GET",
        credentials: "include",
    });
};
