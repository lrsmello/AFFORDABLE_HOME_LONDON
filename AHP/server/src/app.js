const express = require('express');
const app = express();
const cors =  require('cors');

app.use(express.json());
app.use(cors("*"));
// routes from the model
const modelRoutes = require('./routes/modelRoutes');
const utilRoutes = require('./routes/utilRoutes');
app.use('/api/model', modelRoutes);
app.use('/api/util', utilRoutes);

module.exports = app;
