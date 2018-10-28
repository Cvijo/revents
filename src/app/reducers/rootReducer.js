
import { combineReducers } from 'redux';
import {reducer as FromReducer} from 'redux-form'
import testReducer from '../../features/testarea/testReducer';
import eventReducer from '../../features/event/eventReducer';
import modalsReducer from '../../features/modals/modalsReducer';
import authReducer from '../../features/auth/authReducer';
import asnycReducer from '../../features/async/asnycReducer';
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers( {
    test:testReducer,
    events: eventReducer,
    form: FromReducer,
    modals: modalsReducer,
    auth: authReducer,
    async: asnycReducer,
    toastr: toastrReducer
})

export default rootReducer;