// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Init vars
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Import Routes
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');


// DataBase Connection

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {

    if (error) {
        throw error;
    }

    console.log('mongo server on 27017 port: \x1b[32m%s\x1b[0m', 'online');

});


// Routes
app.use('/usuario', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);




// Listen requests
app.listen(3000, () => {
    console.log('express server on 3000 port: \x1b[32m%s\x1b[0m', 'online');
});