const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

// For JSON payloads
app.use(express.json());

// For URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Import routes
const routes = require('./routes');

// Use the routes
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

