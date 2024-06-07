const admin = require('firebase-admin');
const serviceAccount = require('./microfinancedapp-auth-firebase-adminsdk-1jfoq-d5c3c92a2c.json'); 
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
  apiKey: "AIzaSyCoi8pZwaKdry0Ec5Z_5XB0Gh5LY7sSnP4",
  authDomain: "microfinancedapp-auth.firebaseapp.com",
  projectId: "microfinancedapp-auth",
  storageBucket: "microfinancedapp-auth.appspot.com",
  messagingSenderId: "560185607533",
  appId: "1:560185607533:web:7c074e74a1ab6da0c80664",
  measurementId: "G-XHENPTCPRT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

module.exports = { admin, auth };

