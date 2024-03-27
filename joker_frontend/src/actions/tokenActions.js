export const SET_AUTH = 'SET_AUTH';
export const CLEAR_AUTH = 'CLEAR_AUTH';

export const setAuth = (auth) => ({
    type: SET_AUTH,
    payload: auth
});

export const clearAuth = () => ({
    type: CLEAR_AUTH,
    payload: {
        token: "",
        isAdmin: false
    }
});