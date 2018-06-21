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
var hospitalRoutes = require('./routes/hospital');
var medicRoutes = require('./routes/medic');
var uploadRoutes = require('./routes/upload');
var searchRoutes = require('./routes/search');
var imagesRoutes = require('./routes/images');


// DataBase Connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {

    if (error) {
        throw error;
    }

    console.log('mongo server on 27017 port: \x1b[32m%s\x1b[0m', 'online');

});


// Server Index Config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Routes
app.use('/usuario', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/images', imagesRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Listen requests
app.listen(3000, () => {
    console.log('express server on 3000 port: \x1b[32m%s\x1b[0m', 'online');
});