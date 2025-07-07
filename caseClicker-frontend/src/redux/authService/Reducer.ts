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
} from "./ActionType";

export interface AuthState {
    loading: boolean;
    error: string | null;
    loginResponse: any;
    registerResponse: any;
    logoutResponse: any;
    reqUser: any;
}

interface AuthAction {
    type: string;
    payload?: any;
}

const initialValue: AuthState = {
    loading: false,
    error: null,
    loginResponse: null,
    registerResponse: null,
    logoutResponse: null,
    reqUser: null,
};

export const authReducer = (
    state: AuthState = initialValue,
    action: AuthAction
): AuthState => {
    const { type, payload } = action;

    switch (type) {
        case REGISTER_REQUEST:
            return { ...state, loading: true, error: null, registerResponse: null };
        case REGISTER_SUCCESS:
            return { ...state, loading: false, registerResponse: payload };
        case REGISTER_ERROR:
            return { ...state, loading: false, error: payload };

        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                loginResponse: null,
                reqUser: null,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                loginResponse: payload,
                logoutResponse: null,
                reqUser: payload,
            };
        case LOGIN_ERROR:
            return { ...state, loading: false, error: payload };

        case LOGOUT_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                logoutResponse: payload,
                loginResponse: null,
                reqUser: null,
            };
        case LOGOUT_ERROR:
            return { ...state, loading: false, error: payload };

        case REQUEST_USER:
            return { ...state, loading: true, error: null };
        case REQUEST_USER_SUCCESS:
            return { ...state, loading: false, reqUser: payload };
        case REQUEST_USER_ERROR:
            return { ...state, loading: false, error: payload };

        default:
            return state;
    }
};
