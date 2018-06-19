// Requires
var express = require('express');
var mongoose = require('mongoose');


// Init vars
var app = express();


// DataBase Connection

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {

    if (error) {
        throw error;
    }

    console.log('mongo server on 27017 port: \x1b[32m%s\x1b[0m', 'online');

});


// Routes
app.get('/', (request, response, next) => {

    response.status(200).json({
        ok: true,
        messaje: 'OK'
    });

});

// Listen requests
app.listen(3000, () => {
    console.log('express server on 3000 port: \x1b[32m%s\x1b[0m', 'online');
});