//imporation
const dotenv = require("dotenv");

// config/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("../berceau.json");  // Le chemin vers fichier berceau.json

dotenv.config({ path: "./.env" });
// Initialisation de Firebase Admin SDK avec les deux services
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE,  // URL de la base de données Realtime
});

const firestoreDb = admin.firestore();  // Firestore
const realtimeDb = admin.database();    // Realtime Database

module.exports = { firestoreDb, realtimeDb };
