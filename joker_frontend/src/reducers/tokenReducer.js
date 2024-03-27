import {CLEAR_AUTH, SET_AUTH} from '../actions/tokenActions';

const initialState = {
    token: '',
    isAdmin: false
};

const tokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH:
            return {
                ...state,
                token: action.payload.token,
                isAdmin: action.payload.isAdmin
            };
        case CLEAR_AUTH:
            return {
                ...state,
                token: null,
                isAdmin: false
            };
        default:
            return state;
    }
};

export default tokenReducer;