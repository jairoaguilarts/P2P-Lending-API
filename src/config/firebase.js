const admin = require('firebase-admin');
const serviceAccount = require('./microfinancedapp-auth-firebase-adminsdk-1jfoq-d5c3c92a2c.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
