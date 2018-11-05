import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import cuid from 'cuid';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import firebase from '../../app/config/firebase';
import { FETCH_EVENTS } from '../event/eventConstants';





export const updateProfile = (user) => {
    return async (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const { isLoaded, isEmpty, ...updatedUser } = user; //destructurig .. updateuser nema isLoaded i isEmpty

        // if( updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
        if (updatedUser.dateOfBirth && updatedUser.dateOfBirth._isAMomentObject) {
            updatedUser.dateOfBirth = moment(user.dateOfBirth).toDate();
        }


        try {
            await firebase.updateProfile(updatedUser);
            toastr.success('Success', "Profile updated");

        } catch (error) {
            console.log(error);
        }
    }
}

export const uploadProfileImage = (file, fileName) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        const imageName = fileName + "_" + cuid();
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        const path = user.uid + '/user_images';
        const options = {
            name: imageName
        }
        try {
            dispatch(asyncActionStart());
            //upload file to firebase storage
            let upladedFile = await firebase.uploadFile(path, file, null, options)
            //get url from image
            let downloadUrl = await upladedFile.uploadTaskSnapshot.downloadURL
            //get userdoc from firestore
            let userDoc = await firestore.get("users/" + user.uid)
            //check if user get photo insade, if not update profile with new image
            if (!userDoc.data().photoURL) {
                await firebase.updateProfile({
                    photoURL: downloadUrl
                })
                await user.updateProfile({
                    photoURL: downloadUrl
                })
            }
            //add new photo as new image in photos collection
            await firestore.add({
                collection: 'users',
                doc: user.uid,
                subcollections: [{ collection: 'photos' }]
            }, {
                    name: imageName,
                    url: downloadUrl
                })
            dispatch(asyncActionFinish());
        } catch (error) {
            console.log(error);
            dispatch(asyncActionFinish());
            throw new Error('Problem uploading photo !')
        }

    }
}

export const deletePhoto = (photo) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        try {
            await firebase.deleteFile(user.uid + '/user_images/' + photo.name);
            await firestore.delete({
                collection: 'users',
                doc: user.uid,
                subcollections: [{ collection: 'photos', doc: photo.id }]
            });
        } catch (error) {
            console.log(error);
            throw new Error('Problem deleteing the photo.')
        }
    }
}


export const setMainPhoto = (photo) => {
    return async (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        try {
            return await firebase.updateProfile({
                photoURL: photo.url
            })
        } catch (error) {
            console.log(error);
            throw new Error('Problem setting main photo.')
        }
    }
}

export const goingToEvent = (event) => {
    return async (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL
        const attendee = {
            going: true,
            photoURL: photoURL || '/assets/user.png',
            displayName: user.displayName,
            host: false,
            joinDate: Date.now()
        }
        try {
            await firestore.update('events/' + event.id, {
                ['attendees.' + user.uid]: attendee
            })
            await firestore.set('event_attendee/' + event.id + '_' + user.uid, {
                eventId: event.id,
                userUid: user.uid,
                eventDate: event.date,
                host: false
            });
            toastr.success('Success', 'You have signed up to the event');

        } catch (error) {
            console.log(error);
            throw new Error('Problem signing up to event.')
        }
    }
}

export const cancelGoingToEvent = (event) => {
    return async (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        try {
            await firestore.update('events/' + event.id, {
                ['attendees.' + user.uid]: firestore.FieldValue.delete()
            })
            await firestore.delete('event_attendee/' + event.id + '_' + user.uid);
            toastr.success('Success', 'You have cancel going to event');

        } catch (error) {
            console.log(error);
            throw new Error('Problem cancelling going to event.')
        }
    }
}

export const getUserEvents = (userUid, activeTab) => {
    return async (dispatch, getSate) => {
        dispatch(asyncActionStart());
        const firestore = firebase.firestore();
        const today = new Date(Date.now());
        let eventsRef = firestore.collection('event_attendee');
        let query;
        switch (activeTab) {
            case 1: //past events
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .where('eventDate', '<=', today)
                    .orderBy('eventDate', 'desc');
                break;
            case 2: //future events
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .where('eventDate', '>=', today)
                    .orderBy('eventDate');
                break;
            case 3: //hosted events
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .where('host', '==', true)
                    .orderBy('eventDate', 'desc');
                break;
            default: //all my events
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .orderBy('eventDate', 'desc');
                break;
        }

        try {
            let querySnap = await query.get();
            let events = [];

            for (let i = 0; i < querySnap.docs.length; i++) {
                let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get();
                //let evt2 = await firestore.collection('events').where('id', '==', querySnap.docs[i].data().eventId).get();
                events.push({...evt.data(), id: evt.id});
            }
            dispatch({type:FETCH_EVENTS, payload: {events}})
            dispatch(asyncActionFinish());
        } catch (error) {
            console.log(error);
            dispatch(asyncActionError());
            throw new Error(error.message);
        }
    }
}