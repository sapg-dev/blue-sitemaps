const { MongoClient, ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const MONGO_URI = process.env.MONGO_URI;

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  try {
    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const collection = client.db("blue-sitemaps").collection("data");
    
    const { body } = event;
    if (!body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Request body is missing" }) };
    }

    const { newState } = JSON.parse(body);
    const id = event.path.split('/').pop();
    if (!ObjectId.isValid(id)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid ID' }) };
    }

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { state: newState } }
    );

    await client.close();

    return {
      statusCode: updateResult.matchedCount === 0 ? 404 : 200,
      body: JSON.stringify({ modifiedCount: updateResult.modifiedCount }),
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
