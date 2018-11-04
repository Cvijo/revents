import { toastr } from 'react-redux-toastr';
import {  DELETE_EVENT, FETCH_EVENTS } from './eventConstants';
import { fetchSampleData } from '../../app/data/mockApi';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment';





export const fetchEvents = (events) => {
    return {
        type: FETCH_EVENTS,
        payload: events
    }
}

export const createEvent = (event) => {
    return async (dispatch, getState, {getFirestore} ) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        let newEvent = createNewEvent(user, photoURL, event);
        try {
            dispatch(asyncActionStart());
            let createdEvent = await firestore.add("events", newEvent);
            const documentPath = "event_attendee/" + createdEvent.id + '_' + user.uid; 
            await firestore.set(documentPath, {
                eventId:createdEvent.id,
                userUid: user.uid, 
                eventDate: event.date, 
                host: true
            })
            dispatch(asyncActionFinish());
            toastr.success('Success', 'Event has been created.');        
        } catch(error) {
            dispatch(asyncActionFinish());
            toastr.error('Ooops', error);
        }
    }
}

export const updateEvent = (event) => {
    return async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        if( event.date !== getState().firestore.ordered.events[0].date) {
            event.date = moment(event.date).toDate();    
        }
        try {
            await firestore.update('events/' + event.id, event);
            toastr.success('Success', 'Event has been updated.');
        
        } catch(error) {
            toastr.error('Ooops', error);
        }
    }
}

export const cancelToggle = (cancelled, eventId) => {
    return async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        try {
            const message = cancelled ? 'Are you sure you want to cancel the event' : 'This will reactivate the event, are you sure';
            toastr.confirm(message, {
                onOk: () => {
                firestore.update('events/' + eventId, {cancelled: cancelled});
                toastr.success('Success', 'Event has been canclled');
            }

            })
        
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