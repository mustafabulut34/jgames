import {combineReducers} from "redux";
import tokenReducer from "./tokenReducer";

export default combineReducers({
    auth: tokenReducer,
})