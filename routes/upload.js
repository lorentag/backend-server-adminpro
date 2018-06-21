var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

var User = require('../models/user');
var Hospital = require('../models/hospital');
var Medic = require('../models/medic');

// fileSystem
var fs = require('fs');

// default options
app.use(fileUpload());

app.put('/:collection/:id', (request, response, next) => {

    var collection = request.params.collection;
    var userId = request.params.id;

    // collections types
    var collectionKinds = ['users', 'medics', 'hospitals'];
    if (collectionKinds.indexOf(collection) < 0) {
        return response.status(400).json({
            ok: false,
            messaje: 'Invalid collection ',
            errors: { error: 'Invalid collection' }
        });
    }

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            messaje: 'Anithing selected ',
            errors: { error: 'Anithing selected' }
        });
    }

    // Get file name
    var file = request.files.img;
    var splitFile = file.name.split('.');
    var extFile = splitFile[splitFile.length - 1];

    // Acepted Extencions
    var validExt = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExt.indexOf(extFile) < 0) {
        return response.status(400).json({
            ok: false,
            messaje: 'Invalid extension ',
            errors: { error: 'Invalid Extension' }
        });
    }

    // Personal file name
    var fileName = `${ userId }-${ new Date().getMilliseconds() }.${ extFile }`;


    // move file to specific path
    var path = `./uploads/${ collection }/${ fileName }`;
    file.mv(path, error => {

        if (error) {
            return response.status(400).json({
                ok: false,
                messaje: 'Error moving file',
                errors: error
            });
        }

        uploadByTitle(collection, userId, fileName, response);

        // response.status(200).json({
        //     ok: true,
        //     messaje: 'File moved'
        // });
    });





});

function uploadByTitle(type, id, fileName, response) {

    if (type === 'users') {

        User.findById(id, (error, user) => {

            var beforePath = './uploads/users/' + user.img;

            // delete existing img
            if (fs.existsSync(beforePath)) {
                fs.unlink(beforePath);
            }

            user.img = fileName;

            user.save((error, updateduser) => {

                updateduser.password = ':)';

                return response.status(200).json({
                    ok: true,
                    messaje: 'User Image Saved',
                    user: updateduser
                });

            });

        });

    }

    if (type === 'medics') {

        Medic.findById(id, (error, medic) => {

            var beforePath = './uploads/medics/' + medic.img;

            // delete existing img
            if (fs.existsSync(beforePath)) {
                fs.unlink(beforePath);
            }

            medic.img = fileName;

            medic.save((error, updatedmedic) => {

                return response.status(200).json({
                    ok: true,
                    messaje: 'Medic Image Saved',
                    medic: updatedmedic
                });

            });

        });


    }

    if (type === 'hospitals') {

        Hospital.findById(id, (error, hospital) => {

            var beforePath = './uploads/hospitals/' + hospital.img;

            // delete existing img
            if (fs.existsSync(beforePath)) {
                fs.unlink(beforePath);
            }

            hospital.img = fileName;

            hospital.save((error, updatedhospital) => {

                return response.status(200).json({
                    ok: true,
                    messaje: 'Hospital Image Saved',
                    hospital: updatedhospital
                });

            });

        });


    }

}

module.exports = app;