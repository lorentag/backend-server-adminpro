var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicSchema = new Schema({
    name: { type: String, required: [true, 'The name is mandatory'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'The hospital id is mandatory ']
    }
});

module.exports = mongoose.model('Medic', medicSchema);