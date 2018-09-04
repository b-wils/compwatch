// src/firebase.js
import firebase from 'firebase'

// TODO should move this into a config variable
// This is not sensitive info though since it is exposed to client and needed to access

const config = {
    apiKey: "AIzaSyAZCtWUw4dwor276ope1wQwfmwwLJ2Ew6U",
    authDomain: "compwatch-207022.firebaseapp.com",
    databaseURL: "https://compwatch-207022.firebaseio.com",
    projectId: "compwatch-207022",
    storageBucket: "compwatch-207022.appspot.com",
    messagingSenderId: "738339340418"
  };

firebase.initializeApp(config);

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

export default firebase;