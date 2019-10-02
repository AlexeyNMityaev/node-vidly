const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validate(obj) {
    const model = {
        name: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(obj, model);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validate;
