import { createStore, combineReducers, compose, applyMiddleware  } from 'redux'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import { getFirebase, reactReduxFirebase, firebaseReducer  } from 'react-redux-firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
// import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

export default function configureStore(initialState) {

	var	firebaseConfig = {
	    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
	}
	// const rfConfig = {} // optional redux-firestore Config Options

	const rrfConfig = {
		userProfile: 'users', // firebase root where user profiles are stored
		attachAuthIsReady: true, // attaches auth is ready promise to store
		firebaseStateName: 'firebase' // should match the reducer name ('firebase' is default)
	}

	// Initialize firebase instance
	firebase.initializeApp(firebaseConfig)

	// Initialize Cloud Firestore through Firebase
	var firestore = firebase.firestore();

	const settings = {/* your settings... */ timestampsInSnapshots: true};
  	firestore.settings(settings);

	// Add reactReduxFirebase enhancer when making store creator
	const createStoreWithFirebase = compose(
	  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
	  reduxFirestore(firebase), // <- needed if using firestore
	  applyMiddleware(thunk.withExtraArgument(getFirebase))
	)(createStore)

	// Add firebase to reducers
	const rootReducer = combineReducers({
	  firebase: firebaseReducer,
	  firestore: firestoreReducer // <- needed if using firestore
	})

	// Create store with reducers and initial state
	const store = createStoreWithFirebase(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

	// Listen for auth ready (promise available on store thanks to attachAuthIsReady: true config option)
	store.firebaseAuthIsReady.then(() => {
		console.log('Auth has loaded') // eslint-disable-line no-console
	})

	return store;

}