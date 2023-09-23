const http = require('http');

const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
    console.log('In users middleware');
    res.send('<h1> Hello from Users TAB </h1>');
});

app.use('/', (req, res, next) => {
    console.log('In default middleware');
    next();
});

app.use('/', (req, res, next) => {
    console.log('In the connected middleware');
    res.send('<body><ul><li>User 1</li><li>User 2</li></ul></body>');
});


app.listen(3000);