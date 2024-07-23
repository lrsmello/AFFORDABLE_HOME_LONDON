const express = require('express');
const router = express.Router();

router.get('/boroughs', (req, res) => {
    const boroughs = require('../../../../data/boroughs.json');
    res.status(200).json(boroughs).send();
});

router.get('/categories', (req, res) => {
    const categories = require('../../../../data/dimCategoryRoom.json');
    res.status(200).json(categories).send();
});

module.exports = router;
