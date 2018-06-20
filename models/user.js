var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};

var userSchema = new Schema({

    name: { type: String, required: [true, 'The name is mandatory'] },
    email: { type: String, unique: true, required: [true, 'The email is mandatory'] },
    password: { type: String, required: [true, 'The pass is mandatory'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles }

});

userSchema.plugin(uniqueValidator, { message: 'The {PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);