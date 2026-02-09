const express = require('express');
let MongoClient;
try {
  ({ MongoClient } = require('mongodb'));
} catch (_) {
  // mongodb is optional for App Runner single-container deploy
}

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL; // optional

let db = null;

// Try to connect Mongo only if MONGO_URL is provided
(async () => {
  if (!MONGO_URL || !MongoClient) {
    console.log('[boot] Mongo disabled. Using in-memory fallback data.');
    return;
  }
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db();
    console.log('[boot] Connected to MongoDB');
  } catch (err) {
    console.error('[boot] Mongo connect failed. Fallback to in-memory data:', err.message);
    db = null;
  }
})();

app.get('/products', async (req, res) => {
  try {
    if (db) {
      const items = await db.collection('products').find().toArray();
      return res.json(items.length ? items : [{ id: 1, name: 'Book' }, { id: 2, name: 'Pen' }]);
    }
    // Fallback (App Runner-friendly)
    return res.json([{ id: 1, name: 'Book' }, { id: 2, name: 'Pen' }]);
  } catch (e) {
    console.error('[api] /products error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

app.get('/health', (req, res) => res.status(200).send('ok'));

app.listen(PORT, '0.0.0.0', () => console.log(`[boot] API running on ${PORT}`));