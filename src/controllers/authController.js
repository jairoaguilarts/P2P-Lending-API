const { admin, auth } = require('../config/firebase');
const { client } = require('../config/db');
const { signInWithEmailAndPassword } = require("firebase/auth");

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, walletAddress } = req.body;

  try {
    // Conectar a la base de datos de MongoDB
    const database = client.db('microfinance-P2P');
    const usersCollection = database.collection('users');

    // Verificar si ya existe un usuario con la misma billetera
    const existingUser = await usersCollection.findOne({ walletAddress });
    if (existingUser) {
      return res.status(401).json({ message: 'La dirección de la billetera ya está registrada' });
    }

    // Registrar el usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Almacenar la información del usuario en MongoDB
    const userData = {
      uid: userRecord.uid,
      firstName,
      lastName,
      email,
      walletAddress,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(userData);

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Autenticar usuario con Firebase Authentication API
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generar un token personalizado usando Firebase Admin SDK
    const customToken = await admin.auth().createCustomToken(user.uid);

    res.json({
      success: true,
      token: customToken,
      uid: user.uid,
      email: user.email
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ error: 'Invalid email or password' });
  }
};