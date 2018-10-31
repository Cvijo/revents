
import { closeModal } from '../modals/modalActions';
import { SubmissionError, reset } from 'redux-form';
import { toastr } from 'react-redux-toastr';


export const login = (creds) => {
    return async (dispatch, getState, {getFirebase}) => {
        //dispatch({type: LOGIN_USER, payload:{creds}});
        const firebase = getFirebase();
        try{
            await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password);
            dispatch(closeModal());
        }catch (error){
            throw new SubmissionError({
                _error: error.message
            })
        }
    }
}

export const registerUser = (user) => {
    return async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        try{
            //create user in firebase auth
            let createdUser = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);

            //update auth profile
            await createdUser.updateProfile ({
                displayName: user.displayName
            })
            
            //create new profile in firestore            
            let newUser = {
                displayName: user.displayName, 
                createdAt: firestore.FieldValue.serverTimestamp()
            };
            await firestore.set('users/'+ createdUser.uid, {...newUser})
            dispatch(closeModal());
        } catch(error) {
            console.log(error);
            throw new SubmissionError({
                _error:error.message
            })
        }

    }
}

export const socialLogin = (selectedProvider) =>{
    
    return async(dispatch, getState, {getFirebase, getFirestore}) => {
            const firebase = getFirebase();
        try{
            dispatch(closeModal());
            // const faceBookProvider = new firebase.auth.FacebookAuthProvider();    
            // faceBookProvider.setCustomParameters({
            //     'display': 'popup'
            //   });        
            // let user = await firebase.auth().signInWithPopup(faceBookProvider);
            let user = await firebase.login({
                provider: selectedProvider,
                type: 'popup'
            })
            if( user.additionalUserInfo.isNewUser) {
                const firestore = getFirestore();
                await firestore.set('users/' + user.user.uid, {
                    displayName: user.profile.displayName, 
                    photoURL: user.profile.avatarUrl, 
                    createAt: firestore.FieldValue.serverTimestamp()
                })
            }
        }catch (error){
            console.log(error);
        }
    }
}

export const updatePassword = (creds) => {

    return async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        try {
            await user.updatePassword(creds.newPassword1)
            await dispatch(reset('account'));
            toastr.success('Success', 'Your password has been updated');
        }catch(error) {
            throw new SubmissionError({
                _error: error.message
            })
        }
    }
}