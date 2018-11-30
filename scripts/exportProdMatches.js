// From https://blog.cloudboost.io/copy-export-a-cloud-firestore-database-388cde99259b

const admin = require('firebase-admin');

var serviceAccount = require("./config/compwatch-admin-prod.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const dumped = {};

// const schema = {
//   matches: {
//     friends: {
//       messages: {},
//     },
//     groups: {
//       messages: {},
//     },
//   },
//   groups: {},
// };

const schema = {
  matches: {},
};


var db = admin.firestore();

const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

const dump = (dbRef, aux, curr) => {
  return Promise.all(Object.keys(aux).map((collection) => {
    return dbRef.collection(collection).get()
      .then((data) => {
        let promises = [];
        data.forEach((doc) => {
          const data = doc.data();
          if(!curr[collection]) {
            curr[collection] =  { 
              data: { },
              type: 'collection',
            };
            curr[collection].data[doc.id] = {
              data,
              type: 'document',
            }
          } else {
            curr[collection].data[doc.id] = data;
          }
          promises.push(dump(dbRef.collection(collection).doc(doc.id), aux[collection], curr[collection].data[doc.id]));
      })
      return Promise.all(promises);
    });
  })).then(() => {
    return curr;
  })
};

let aux = { ...schema };
let answer = {};
dump(db, aux, answer).then((answer) => {
  console.log(JSON.stringify(answer, null, 4));
});