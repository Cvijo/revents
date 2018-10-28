import { ASYNC_ACTION_ERROR, ASYNC_ACTION_START, ASYNC_ACTION_FINISH } from './asyncConstants';
import { createReducer } from '../../app/common/util/reducerUtil';

const initialState = {
    loading: false
}


export const asyncActionsStarted =(state) => {
    return {...state, loading:true}
}

export const asyncActionsFinished =(state) => {
    return {...state, loading:false}
}

export const asyncActionsError =(state) => {
    return {...state, loading:false}
}

export default createReducer( initialState, {
    [ASYNC_ACTION_START]: asyncActionsStarted,
    [ASYNC_ACTION_FINISH]: asyncActionsFinished,
    [ASYNC_ACTION_ERROR]: asyncActionsError
})