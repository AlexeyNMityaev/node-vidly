const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: { 
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: { 
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    dailyRentalRate: { 
        type: Number,
        min: 0,
        max: 255,
        required: true
    }
}));

function validate(obj) {
    const model = {
        title: Joi.string().min(3).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    };
    return Joi.validate(obj, model);
}

module.exports.Movie = Movie;
exports.validate = validate;
