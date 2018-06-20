var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuth = require('../middlewares/autentication');

var app = express();

var User = require('../models/user');

//====================================================
// Get All Users
//====================================================
app.get('/', (request, response, next) => {

    User.find({}, 'name email img role').exec(
        (error, users) => {

            if (error) {
                return response.status(500).json({
                    ok: false,
                    messaje: 'Loading users error...',
                    errors: error
                });
            }

            response.status(200).json({
                ok: true,
                users: users
            });

        });

});



//====================================================
// Update User
//====================================================
app.put('/:id', mdAuth.tokenVerify, (request, response) => {

    var id = request.params.id;
    var body = request.body;

    User.findById(id, (error, user) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                messaje: 'User not found...',
                errors: error
            });
        }

        if (!user) {
            return response.status(400).json({
                ok: false,
                messaje: 'User with id:' + id + 'not found...',
            });
        }


        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((error, savedUser) => {
            if (error) {

                return response.status(400).json({
                    ok: false,
                    messaje: 'Update user error...',
                    errors: error
                });

            }

            response.status(200).json({
                ok: true,
                user: savedUser
            });
        });

    });

});

//====================================================
// Create User
//====================================================
app.post('/', mdAuth.tokenVerify, (request, response) => {

    var body = request.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    user.save((error, saveUser) => {

        if (error) {
            return response.status(400).json({
                ok: false,
                messaje: 'Saving user error...',
                errors: error
            });
        }

        response.status(201).json({
            ok: true,
            user: saveUser
        });

    });

});

//====================================================
// Delete User by id
//====================================================
app.delete('/:id', mdAuth.tokenVerify, (request, response) => {

    var id = request.params.id;

    User.findByIdAndRemove(id, (error, deleteduser) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                messaje: 'Deleting user error...',
                errors: error
            });
        }

        if (deleteduser) {
            return response.status(400).json({
                ok: false,
                messaje: 'User with id:' + id + 'not found',
                errors: { message: 'Bad request' }
            });
        }

        response.status(200).json({
            ok: true,
            user: deleteduser
        });

    });

});


module.exports = app;