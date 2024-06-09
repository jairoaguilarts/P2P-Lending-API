const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://DesAppsVanJ:1Dtljhc8vr3yhaDE@cluster0.zbbqvgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true, 
  tlsAllowInvalidCertificates: false, 
});

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

module.exports = {
  connectToDatabase,
  client,
};
