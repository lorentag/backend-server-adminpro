var express = require('express');
var app = express();

var path = require('path');
var fs = require('fs');

app.get('/:collection/:img', (request, response, next) => {

    var collection = request.params.collection;
    var img = request.params.img;

    // collections types
    var collectionKinds = ['users', 'medics', 'hospitals'];
    if (collectionKinds.indexOf(collection) < 0) {
        return response.status(400).json({
            ok: false,
            messaje: 'Invalid collection ',
            errors: { error: 'Invalid collection' }
        });
    }

    var pathImg = path.resolve(__dirname, `../uploads/${ collection }/${ img }`);

    if (fs.existsSync(pathImg)) {
        response.sendFile(pathImg);
    } else {
        var pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg');
        response.sendFile(pathNoImg);
    }

});

module.exports = app;