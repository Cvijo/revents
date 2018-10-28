import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig ={
    apiKey: "AIzaSyADnZDiF-ffixVFD_FZoOmj1KmNPuhjvv0",
    authDomain: "revents-220710.firebaseapp.com",
    databaseURL: "https://revents-220710.firebaseio.com",
    projectId: "revents-220710",
    storageBucket: "revents-220710.appspot.com",
    messagingSenderId: "664319162101"
}

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
    timestampsInSnapshots: true
}

firestore.settings(settings);
export default firebase;
