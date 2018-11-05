import { toastr } from 'react-redux-toastr';
import { FETCH_EVENTS } from './eventConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment';
import firebase from '../../app/config/firebase';





export const createEvent = (event) => {
    return async (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        let newEvent = createNewEvent(user, photoURL, event);
        try {
            dispatch(asyncActionStart());
            let createdEvent = await firestore.add("events", newEvent);
            const documentPath = "event_attendee/" + createdEvent.id + '_' + user.uid;
            await firestore.set(documentPath, {
                eventId: createdEvent.id,
                userUid: user.uid,
                eventDate: event.date,
                host: true
            })
            dispatch(asyncActionFinish());
            toastr.success('Success', 'Event has been created.');
        } catch (error) {
            dispatch(asyncActionFinish());
            toastr.error('Ooops', error);
        }
    }
}

export const updateEvent = (event) => {
    return async (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        if (event.date !== getState().firestore.ordered.events[0].date) {
            event.date = moment(event.date).toDate();
        }
        try {
            await firestore.update('events/' + event.id, event);
            toastr.success('Success', 'Event has been updated.');

        } catch (error) {
            toastr.error('Ooops', error);
        }
    }
}

export const cancelToggle = (cancelled, eventId) => {
    return async (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        try {
            const message = cancelled ? 'Are you sure you want to cancel the event' : 'This will reactivate the event, are you sure';
            toastr.confirm(message, {
                onOk: () => {
                    firestore.update('events/' + eventId, { cancelled: cancelled });
                    toastr.success('Success', 'Event has been canclled');
                }

            })

        } catch (error) {
            toastr.error('Ooops', error);
        }
    }
}


export const getEventsForDashboard = (lastEvent) => {
    return async (dispatch) => {
        let today = new Date(Date.now());
        const firestore = firebase.firestore();
        const eventsRef = firestore.collection('events')
            .where('date', '>=', today)
            .orderBy('date').limit(2);
        try {
            dispatch(asyncActionStart());
            let query;
            let startAfter = lastEvent && await firestore.collection('events').doc(lastEvent.id).get();
            lastEvent ? query = eventsRef.startAfter(startAfter) : query = eventsRef
            let querySnap = await query.get();
            if (querySnap.docs.length === 0) {
                dispatch(asyncActionFinish());
                return querySnap;
            }
            let events = [];
            for (let i = 0; i < querySnap.docs.length; i++) {
                let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id }
                events.push(evt);
            }
            dispatch({ type: FETCH_EVENTS, payload: { events } })
            dispatch(asyncActionFinish());
            return querySnap;
        } catch (error) {
            console.log(error);
            dispatch(asyncActionError());
        }
    }
}

export const addEventComment = (eventId, values, parentId) => {
    return async (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const profile = getState().firebase.profile;
        const user = firebase.auth().currentUser;
        const newComment = {
            parentId: parentId,
            displayName: profile.displayName, 
            photoURL: profile.photoURL || '/assets/user.png',
            uid: user.uid, 
            text: values.comment, 
            date: Date.now()            
        }
        try {
            
            await firebase.push('event_chat/'+ eventId, newComment)
        } catch (error) {
            console.log(error);
            toastr.error('Ooops', error.message);
        }
    }
}