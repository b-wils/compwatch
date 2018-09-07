import { createStore, combineReducers, compose, applyMiddleware  } from 'redux'
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import { getFirebase, reactReduxFirebase, firebaseReducer  } from 'react-redux-firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
// import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

// TODO need a more elegant way to load config from a file
var config;
switch (process.env.NODE_ENV) {
	case 'production':
		config = require('../config/prod')
		break;
	case 'development':
		config = require('../config/dev')
		break;
	case 'test':
		config = require('../config/test')
		break;
	default:
		console.log('warning could not determine environment, using dev firebase config')
		config = require('../config/dev')
		break;
}

var firebaseConfig = config.firebaseConfig;

export default function configureStore(initialState) {

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