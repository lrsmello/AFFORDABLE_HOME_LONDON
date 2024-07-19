const express = require('express');
const app = express();

app.use(express.json());

// routes from the model
const modelRoutes = require('./routes/modelRoutes');
app.use('/api/model', modelRoutes);

module.exports = app;
