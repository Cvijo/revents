import moment from 'moment';
import { toastr } from 'react-redux-toastr';


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