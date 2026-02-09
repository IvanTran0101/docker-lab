const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/appdb';

let db;

(async () => {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB');
})();

app.get('/products', async (req, res) => {
  const items = await db.collection('products').find().toArray();
  res.json(items.length ? items : [{ id: 1, name: 'Book' }, { id: 2, name: 'Pen' }]);
});

app.listen(PORT, () => console.log(`API running on ${PORT}`));