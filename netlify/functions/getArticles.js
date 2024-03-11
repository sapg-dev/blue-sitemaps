require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
  try {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();
    const collection = client.db("blue-sitemaps").collection("data");
    const articles = await collection.find({}).toArray();

    console.log(articles);
  } catch (error) {
    console.error(error);
  }
}

main();
