const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const MONGO_URI = process.env.MONGO_URI;

  try {
    if (event.httpMethod !== 'PATCH') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const data = JSON.parse(event.body);
    const id = event.path.split('/')[event.path.split('/').length - 1]; // Extract ID from path
    const newState = data.newState;

    if (!ObjectId.isValid(id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid ID' })
      };
    }

    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const collection = client.db("blue-sitemaps").collection("datta");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { state: newState } }
    );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
} catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
};}
