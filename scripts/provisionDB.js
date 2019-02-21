require('dotenv').config()

var heroes = require('./heroes');
var maps = require('./maps')
var matches = require('./matches')
var firebase = require('firebase-admin');

var serviceAccount = process.env.FIREBASE_ADMIN_CONFIG;

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

var db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

heroes.forEach((hero) => {
	var docRef = db.collection('heroes').doc(hero.name);
	var setHero = docRef.set(hero);
})

maps.forEach((map) => {
	var docRef = db.collection('maps').doc(map.name);
	var setMap = docRef.set(map);
});

// Object.keys(matches).forEach((matchId) => {

// 	var match = matches[matchId].data ? matches[matchId].data : matches[matchId];

// 	// Need to convert to date so firestore will convert these to timestamps
// 	if (match.localTime) {
// 		match.localTime = new Date(match.localTime._seconds*1000)	
// 	}
	
// 	if (match.firebaseTime) {
// 		match.firebaseTime = new Date(match.firebaseTime._seconds*1000)
// 	}

// 	var docRef = db.collection('matches').doc(matchId);
// 	var setMap = docRef.set(match);

// })