import {LOGIN_USER, SIGNOUT_USER} from './authConstants';
import { createReducer } from '../../app/common/util/reducerUtil';

const initialState = {
    currentUser:{}
}

export const loginUser = (state, payload) => {
    return {
        ...state, 
        isAuth: true, 
        currentUser: payload.creds.email
    }
}

export const signOutUser = (state, payload) => {
    return {
        ...state, 
        isAuth: false, 
        currentUser: {}
    }
}

export default createReducer(initialState, {
    [LOGIN_USER]: loginUser, 
    [SIGNOUT_USER]: signOutUser
})

