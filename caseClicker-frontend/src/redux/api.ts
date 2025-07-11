import type {Dispatch} from "redux";
import {LOGIN_SUCCESS, LOGOUT_SUCCESS} from "./authService/ActionType.ts";

export const BASE_API_URL = "http://localhost:8000/api";

type FetchResult = Record<string, any> | string | { error: true; message: string };

interface FetchOptions extends RequestInit {
    params?: Record<string, any>;
}

export const fetchWithAuth = async (
    url: string,
    options: FetchOptions = {},
    errorType: string
): Promise<FetchResult> => {
    const fullUrl = `${BASE_API_URL}${url}`;
    const isForm = options.body instanceof FormData;

    const headers: HeadersInit = {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
    };

    try {
        const response = await fetch(fullUrl, {
            ...options,
            headers,
            credentials: "include",
        });

        if (response.status === 401) {
            window.location.href = "/login";
            return { error: true, message: "Unauthorized. Please log in." };
        }

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            const msg =
                data.message ||
                data.error ||
                (data.validationErrors && data.validationErrors.join(", ")) ||
                "Request failed";
            return { error: true, message: msg };
        }

        const contentType = response.headers.get("content-type") || "";
        return contentType.includes("application/json") ? response.json() : response.text();
    } catch (err: any) {
        console.error(`Error in ${errorType}:`, err);
        throw new Error(err.message);
    }
};

export const dispatchAction = async (
    dispatch: Dispatch,
    requestType: string,
    successType: string,
    errorType: string,
    url: string,
    options: FetchOptions = {}
): Promise<FetchResult> => {
    dispatch({ type: requestType });

    let finalUrl = url;

    if (options.params) {
        const cleanParams: Record<string, string> = Object.entries(options.params)
            .filter(([, v]) => v !== undefined && v !== null && v !== "")
            .reduce((acc, [k, v]) => {
                acc[k] = String(v);
                return acc;
            }, {} as Record<string, string>);

        const qs = new URLSearchParams(cleanParams).toString();
        finalUrl = qs ? `${url}?${qs}` : url;
        delete options.params;
    }

    try {
        const result = await fetchWithAuth(finalUrl, options, requestType);

        if ((result as any).error) {
            dispatch({ type: errorType, payload: (result as any).message });
            throw new Error((result as any).message);
        }

        dispatch({ type: successType, payload: result });

        if (successType === LOGIN_SUCCESS) {
            localStorage.setItem("isLoggedIn", "1");
        } else if (successType === LOGOUT_SUCCESS) {
            localStorage.removeItem("isLoggedIn");
        }

        return result;
    } catch (err: any) {
        dispatch({ type: errorType, payload: err.message });
        throw err;
    }
};
