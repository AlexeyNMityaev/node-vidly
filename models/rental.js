const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            isGold: {
                type: Boolean,
                default: false
            },
            name: { 
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            phone: { 
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: { 
                type: String,
                required: true,
                minlength: 3,
                maxlength: 255
            },
            dailyRentalRate: { 
                type: Number,
                min: 0,
                max: 255,
                required: true
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({ 
        'customer._id': customerId, 
        'movie._id': movieId 
    });
}

rentalSchema.methods.return = function() {
    this.dateReturned = new Date();

    this.rentalFee = moment().diff(this.dateOut, 'days') * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validate(obj) {
    const model = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(obj, model);
}

module.exports.Rental = Rental;
exports.validate = validate;
