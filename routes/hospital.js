var express = require('express');
var mdAuth = require('../middlewares/autentication');

var app = express();

var Hospital = require('../models/hospital');

//====================================================
// Get All Hospitals
//====================================================
app.get('/', (request, response, next) => {

    var from = request.query.from || 0;
    from = Number(from);

    Hospital.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .exec(
            (error, hospitals) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        messaje: 'Loading hospitals error...',
                        errors: error
                    });
                }


                Hospital.count({}, (error, count) => {

                    response.status(200).json({
                        ok: true,
                        hospitals: hospitals,
                        total: count
                    });

                });



            });

});



//====================================================
// Update Hospitals
//====================================================
app.put('/:id', mdAuth.tokenVerify, (request, response) => {

    var id = request.params.id;
    var body = request.body;

    Hospital.findById(id, (error, hospital) => {

        if (error) {
            return response.status(500).json({
                ok: false,
                messaje: 'Hospital not found...',
                errors: error
            });
        }

        if (!hospital) {
            return response.status(400).json({
                ok: false,
                messaje: 'Hospital with id:' + id + 'not found...',
            });
        }


        hospital.name = body.name;
        hospital.user = request.user._id;

        hospital.save((error, savedHospital) => {
            if (error) {

                return response.status(400).json({
                    ok: false,
                    messaje: 'Update hospital error...',
                    errors: error
                });

            }

            response.status(200).json({
                ok: true,
                hospital: savedHospital
            });
        });

    });

});

//====================================================
// Create Hospital
//====================================================
app.post('/', mdAuth.tokenVerify, (request, response) => {

    var body = request.body;

    var hospital = new Hospital({
        name: body.name,
        user: request.user._id
    });

    hospital.save((error, saveHospital) => {

        if (error) {
            return response.status(400).json({
                ok: false,
                messaje: 'Saving hospital error...',
                errors: error
            });
        }

        response.status(201).json({
            ok: true,
            hospital: saveHospital
        });

    });

});

//====================================================
// Delete Hospital by id
//====================================================
app.delete('/:id', mdAuth.tokenVerify, (request, response) => {

    var id = request.params.id;

    Hospital.findByIdAndRemove(id, (error, deletedHospital) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                messaje: 'Deleting hospital error...',
                errors: error
            });
        }

        if (!deletedHospital) {
            return response.status(400).json({
                ok: false,
                messaje: 'Hospital with id:' + id + 'not found',
                errors: { message: 'Bad request' }
            });
        }

        response.status(200).json({
            ok: true,
            hospital: deletedHospital
        });

    });

});


module.exports = app;