require('dotenv').config()

var heroes = require('./heroes');
var maps = require('./maps')
var firebase = require('firebase-admin');

var serviceAccount = process.env.FIREBASE_ADMIN_CONFIG;

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://compwatch-207022.firebaseio.com"
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
})

