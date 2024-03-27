const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const MONGO_URI = process.env.MONGO_URI;


  try {
    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const collection = client.db("blue-sitemaps").collection("data");

    const params = event.queryStringParameters;
    let query = {};
    let sort = {};

    if (params.state) {
      query.state = params.state;
    }
    if (params.curedName) {
      query['cured_name'] = { $regex: params.curedName, $options: 'i' };
    }
    if (params.field && params.field !== 'All Articles') {
      query.field = params.field;
    }
    if (params.website) {
      const websites = Array.isArray(params.website) ? params.website : [params.website];
      query.website = { $in: websites };
    }
    if (params.curedKeyword) {
      const keywords = Array.isArray(params.curedKeyword) ? params.curedKeyword : [params.curedKeyword];
      query.$or = keywords.map(kw => ({ 'cured_name': { $regex: kw, $options: 'i' }}));
    }
    if (params.sortOrder === 'asc' || params.sortOrder === 'desc') {
      sort.lastmod = params.sortOrder === 'asc' ? 1 : -1;
    }

    const articles = await collection.find(query).sort(sort).toArray();
    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(articles),
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
