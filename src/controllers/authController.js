const admin = require('../config/firebase');
const { client } = require('../config/db');

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, walletAddress } = req.body;

  try {
    // Registrar el usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Conectar a la base de datos de MongoDB y almacenar la información del usuario
    const database = client.db('microfinance-P2P');
    const usersCollection = database.collection('users');

    const userData = {
      uid: userRecord.uid,
      firstName,
      lastName,
      email,
      walletAddress,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(userData);

    res.status(201).json({ message: 'User registered successfully', user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};
