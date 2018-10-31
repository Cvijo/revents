import { toastr } from 'react-redux-toastr';
import { CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT, FETCH_EVENTS } from './eventConstants';
import { fetchSampleData } from '../../app/data/mockApi';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';




export const fetchEvents = (events) => {
    return {
        type: FETCH_EVENTS,
        payload: events
    }
}

export const createEvent = (event) => {
    return async dispatch => {
        try {
            dispatch( {type:CREATE_EVENT, payload:{event}});
            toastr.success('Success', 'Event has been created.');
        
        } catch(error) {
            toastr.error('Ooops', error);
        }
    }
}

export const updateEvent = (event) => {
    return async dispatch => {
        try {
            dispatch( {type:UPDATE_EVENT, payload:{event}});
            toastr.success('Success', 'Event has been updated.');
        
        } catch(error) {
            toastr.error('Ooops', error);
        }
    }
}

export const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        payload: {eventId}
    }
}

export const loadEvents = () => {
    return async dispatch => {
        try {
            dispatch(asyncActionStart());
            let events = await fetchSampleData();
            dispatch(fetchEvents(events));
            dispatch(asyncActionFinish());
        } catch(error) {
            dispatch(asyncActionError(error));
        }
    }
}