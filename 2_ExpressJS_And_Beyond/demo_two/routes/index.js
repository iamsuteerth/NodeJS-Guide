const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();


router.get('/', (req, res, next) => {
    console.log('In / middleware');
    res.sendFile(path.join(__dirname, '../', 'views', 'landing.html'));
});


router.get('/users', (req, res, next) => {
    
    res.sendFile(path.join(rootDir, 'views', 'user-page.html'));
});

router.post('/users', (req, res, next) => {
    console.log(req.body);
    console.log('In the /users middleware');
    res.redirect('/');
});

module.exports = router;