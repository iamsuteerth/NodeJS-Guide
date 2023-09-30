const path = require('path');

const express = require('express');

const router = express.Router();

router.use('/', (req, res, next) => {
    console.log('In shop middleware');
    // res.send('<h1> Hello from Express </h1>');
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    // Send methods by default sends text html
});

module.exports = router;