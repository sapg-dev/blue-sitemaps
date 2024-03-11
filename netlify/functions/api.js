require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://blue-sitemaps:tIRguvKmd8d7cDQa@blue.hgntyje.mongodb.net/?retryWrites=true&w=majority&appName=blue";

app.get('/articles', cors(), async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const collection = client.db("blue-sitemaps").collection("data");

    let query = {};
    let sort = {};

    if (req.query.curedName) {
      query['cured_name'] = { $regex: req.query.curedName, $options: 'i' };
    }
    if (req.query.field) {
      query.field = req.query.field;
    }
    if (req.query.website) {
      const websites = Array.isArray(req.query.website) ? req.query.website : [req.query.website];
      query.website = { $in: websites };
    }

    // Handle multiple 'curedKeyword' parameters for OR logic
    if (req.query.curedKeyword) {
      const keywords = Array.isArray(req.query.curedKeyword) ? req.query.curedKeyword : [req.query.curedKeyword];
      query.$or = keywords.map(kw => ({ 'cured_name': { $regex: kw, $options: 'i' }}));
    }

    if (req.query.sortOrder === 'asc' || req.query.sortOrder === 'desc') {
      // Sorting by 'lastmod' field
      sort.lastmod = req.query.sortOrder === 'asc' ? 1 : -1;
    }
    const articles = await collection.find(query).sort(sort).toArray();
    res.json(articles);

    await client.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/websites', cors(), async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const collection = client.db("blue-sitemaps").collection("datta");
    let query = {};

    if (req.query.field) {
      query.field = req.query.field;
    }

    const websites = await collection.distinct('website', query);
    res.json(websites);

    await client.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(cors());
module.exports.handler = serverless(app);