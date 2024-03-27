const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const MONGO_URI = process.env.MONGO_URI;


  try {
    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const collection = client.db("blue-sitemaps").collection("data");

    const params = event.queryStringParameters;
    let query = {};

    if (params.field) {
      query.field = params.field;
    }

    const websites = await collection.distinct('website', query);
    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(websites),
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
