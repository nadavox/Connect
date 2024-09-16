const express = require('express');
const router = express.Router();
const API_KEY = process.env.API_KEY;

const checkApiKey = (req, res, next) => {
  if (!req.headers['api-key'] || req.headers['api-key'] !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  next();
};

router.use(checkApiKey);

const item_routes = require('./routes/item_routes');
const items_routes = require('./routes/items_routes');
const category_routes = require('./routes/category_routes');

router.get('/', (req, res) => {
  res.send('Hello, World!');
});
router.use('/item', item_routes);
router.use('/items', items_routes);
router.use('/category', category_routes);

module.exports = router;
