require('dotenv').config()

var heroes = require('./heroes');

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

