
import { combineReducers } from 'redux';
import {reducer as FromReducer} from 'redux-form'
import testReducer from '../../features/testarea/testReducer';
import eventReducer from '../../features/event/eventReducer';
import modalsReducer from '../../features/modals/modalsReducer';
import authReducer from '../../features/auth/authReducer';

const rootReducer = combineReducers( {
    test:testReducer,
    events: eventReducer,
    form: FromReducer,
    modals: modalsReducer,
    auth: authReducer
})

export default rootReducer;