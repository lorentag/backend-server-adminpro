var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medic = require('../models/medic');
var User = require('../models/user');



// ======================================================
// General Search
// ======================================================
app.get('/all/:criteria', (request, response, next) => {

    var criteria = request.params.criteria;
    var regex = new RegExp(criteria, 'i');

    Promise.all([
        searchHospitals(criteria, regex),
        searchMedics(criteria, regex),
        searchUsers(criteria, regex)
    ]).then(responses => {

        response.status(200).json({
            ok: true,
            hospitals: responses[0],
            medics: responses[1],
            users: responses[2]
        });

    });

});

// ======================================================
// Search by Collection
// ======================================================
app.get('/collection/:document/:criteria', (request, response, next) => {

    var criteria = request.params.criteria;
    var regex = new RegExp(criteria, 'i');

    var document = request.params.document;

    switch (document) {
        case 'users':
            searchUsers(criteria, regex).then(users => {
                response.status(200).json({
                    ok: true,
                    users: users
                });
            });
            break;
        case 'medics':
            searchMedics(criteria, regex).then(medics => {
                response.status(200).json({
                    ok: true,
                    medics: medics
                });
            });
            break;
        case 'hospitals':
            searchHospitals(criteria, regex).then(hospitals => {
                response.status(200).json({
                    ok: true,
                    [document]: hospitals
                });
            });
            break;
        default:
            return response.status(400).json({
                ok: false,
                messaje: 'The collection ' + document + ' does not exist',
            });
    }



});





function searchHospitals(criteria, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((error, hospitals) => {

                if (error) {
                    reject('Error searching into hospitals' + error);
                } else {
                    resolve(hospitals);
                }
            });

    });

}


function searchMedics(criteria, regex) {

    return new Promise((resolve, reject) => {

        Medic.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((error, medics) => {

                if (error) {
                    reject('Error searching into medics' + error);
                } else {
                    resolve(medics);
                }

            });

    });

}

function searchUsers(criteria, regex) {

    return new Promise((resolve, reject) => {

        User.find({}, 'name email role')
            .or([{ name: regex }, { email: regex }])
            .exec((error, users) => {


                if (error) {
                    reject('Error searching into users' + error);
                } else {
                    resolve(users);
                }

            });

    });

}

module.exports = app;