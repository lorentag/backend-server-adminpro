var express = require('express');
var mdAuth = require('../middlewares/autentication');

var app = express();

var Medic = require('../models/medic');

//====================================================
// Get All Medics
//====================================================
app.get('/', (request, response, next) => {

    var from = request.query.from || 0;
    from = Number(from);

    Medic.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec(
            (error, medics) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        messaje: 'Loading medics error...',
                        errors: error
                    });
                }


                Medic.count({}, (error, count) => {

                    response.status(200).json({
                        ok: true,
                        medics: medics,
                        total: count
                    });

                });


            });

});



//====================================================
// Update Medics
//====================================================
app.put('/:id', mdAuth.tokenVerify, (request, response) => {

    var id = request.params.id;
    var body = request.body;

    Medic.findById(id, (error, medic) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                messaje: 'Medic not found...',
                errors: error
            });
        }

        if (!medic) {
            return response.status(400).json({
                ok: false,
                messaje: 'Medic with id:' + id + 'not found...',
            });
        }


        medic.name = body.name;
        medic.user = request.user._id;
        medic.hospital = body.hospital;

        medic.save((error, savedMedic) => {
            if (error) {

                return response.status(400).json({
                    ok: false,
                    messaje: 'Update Medic error...',
                    errors: error
                });

            }

            response.status(200).json({
                ok: true,
                medic: savedMedic
            });
        });

    });

});

//====================================================
// Create Medic
//====================================================
app.post('/', mdAuth.tokenVerify, (request, response) => {

    var body = request.body;

    var medic = new Medic({
        name: body.name,
        user: request.user._id,
        hospital: body.hospital
    });

    medic.save((error, saveMedic) => {

        if (error) {
            return response.status(400).json({
                ok: false,
                messaje: 'Saving Medic error...',
                errors: error
            });
        }

        response.status(201).json({
            ok: true,
            medic: saveMedic
        });

    });

});

//====================================================
// Delete Medic by id
//====================================================
app.delete('/:id', mdAuth.tokenVerify, (request, response) => {

    var id = request.params.id;

    Medic.findByIdAndRemove(id, (error, deletedMedic) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                messaje: 'Deleting Medic error...',
                errors: error
            });
        }

        if (!deletedMedic) {
            return response.status(400).json({
                ok: false,
                messaje: 'Medic with id:' + id + 'not found',
                errors: { message: 'Bad request' }
            });
        }

        response.status(200).json({
            ok: true,
            Medic: deletedMedic
        });

    });

});


module.exports = app;