const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Add new middleware function
// Executed for every request
// Next is a function which will be passed to the function inside use
// app.use((req, res, next) => {
//     console.log('In the middleware');
//     next();
//     // Necessary to go onto next middleware
// });
// app.use('/', (req, res) => {}); // The '/' is the default

// This is to be kept at the top of your code because we want this to be executed by default and this is also registered as a middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);