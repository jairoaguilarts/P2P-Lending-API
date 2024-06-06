const { client } = require('../config/db');

exports.home = async (req, res) => {
  try {
    const database = client.db('microfinance-P2P');
    const collection = database.collection('users');
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error });
  }
};
