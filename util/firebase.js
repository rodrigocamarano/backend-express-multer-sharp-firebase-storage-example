const admin = require("firebase-admin");

const serviceAccount = require('../key/firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE
});

const bucket = admin.storage().bucket();

exports.bucket = bucket;