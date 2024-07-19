const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');
const { validateUserInformation } = require('../middlewares/validateUserInformation');

router.post('/run', validateUserInformation, modelController.runModel);

module.exports = router;
