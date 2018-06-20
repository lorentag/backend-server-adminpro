var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//====================================================
// Token Verify
//====================================================
exports.tokenVerify = function(request, response, next) {

    var token = request.query.token;

    jwt.verify(token, SEED, (error, decoded) => {

        if (error) {
            return response.status(401).json({
                ok: false,
                messaje: 'Invalid Token',
                errors: error
            });
        }

        request.user = decoded.user;
        next();

        // response.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });

    });

};