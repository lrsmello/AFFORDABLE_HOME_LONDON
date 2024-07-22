const express = require('express');
const app = express();
const cors =  require('cors');

app.use(express.json());
app.options('*',cors());
// app.use(cors);
// routes from the model
const modelRoutes = require('./routes/modelRoutes');
app.use('/api/model', modelRoutes);

module.exports = app;
