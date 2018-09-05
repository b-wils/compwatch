import { createStore, combineReducers, compose } from 'redux'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import { composeWithDevTools } from 'redux-devtools-extension';

export default function configureStore(initialState) {

	// TODO should move this into a config variable
	// This is not sensitive info though since it is exposed to client and needed to access

	const firebaseConfig = {
	    apiKey: "AIzaSyAZCtWUw4dwor276ope1wQwfmwwLJ2Ew6U",
	    authDomain: "compwatch-207022.firebaseapp.com",
	    databaseURL: "https://compwatch-207022.firebaseio.com",
	    projectId: "compwatch-207022",
	    storageBucket: "compwatch-207022.appspot.com",
	    messagingSenderId: "738339340418"
	  };

	const rfConfig = {} // optional redux-firestore Config Options

	// Initialize firebase instance
	firebase.initializeApp(firebaseConfig)
	// Initialize Cloud Firestore through Firebase
	var firestore = firebase.firestore();

	const settings = {/* your settings... */ timestampsInSnapshots: true};
  	firestore.settings(settings);

	// Add reduxFirestore store enhancer to store creator
	const createStoreWithFirebase = compose(
	  reduxFirestore(firebase, rfConfig), // firebase instance as first argument, rfConfig as optional second
	)(createStore)

	// Add Firebase to reducers
	const rootReducer = combineReducers({
	  firestore: firestoreReducer
	})

	// Create store with reducers and initial state
	const store = createStoreWithFirebase(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

	return store;

}