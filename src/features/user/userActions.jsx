import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import cuid from 'cuid';
import { asyncActionStart, asyncActionFinish } from '../async/asyncActions';




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

