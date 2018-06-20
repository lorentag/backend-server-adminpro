var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var User = require('../models/user');

app.post('/', (request, response) => {

    var body = request.body;

    User.findOne({ email: body.email }, (error, bdUser) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                messaje: 'User not found...',
                errors: error
            });
        }

        if (!bdUser) {
            return response.status(400).json({
                ok: false,
                messaje: 'Invalid credentials - email',
            });
        }

        if (!bcrypt.compareSync(body.password, bdUser.password)) {
            return response.status(400).json({
                ok: false,
                messaje: 'Invalid credentials - pass',
            });
        }

        // Create token !!!!
        bdUser.password = ':)';
        var token = jwt.sign({ user: bdUser }, SEED, { expiresIn: 14400 }); // 4 hours

        response.status(200).json({
            ok: true,
            message: 'Login works',
            usuario: bdUser,
            token: token,
            id: bdUser.id
        });

    });

});



module.exports = app;