var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var User = require('../models/user');

// Google
var CLIENT_ID = require('../config/config').ClIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);




// ======================================================
// Google Ahutentication
// ======================================================


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    const user = {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };

    return user;

}


app.post('/google', async(request, response) => {

    var token = request.body.token;

    var googleUser = await verify(token).catch(error => {

        return response.status(403).json({
            ok: false,
            messaje: 'Invalid token',
            error: error
        });

    });


    User.findOne({ email: googleUser.email }, (error, bdUser) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                messaje: 'User not found...',
                errors: error
            });
        }

        if (bdUser) {

            if (!bdUser.google) {
                return response.status(400).json({
                    ok: false,
                    messaje: 'Email already in use'
                });
            } else {

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

            }
        } else {
            // The user doesn't exist, we have to create it
            var user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.password = '(:';
            user.google = true;

            user.save((error, bdUser) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        messaje: 'User not found...',
                        errors: error
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

        }

    });

    // return response.status(200).json({
    //     ok: true,
    //     messaje: 'response',
    //     googleUser: googleUser
    // });

});





// ======================================================
// Regular Ahutentication
// ======================================================

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