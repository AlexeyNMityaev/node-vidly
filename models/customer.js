const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
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
}));

function validate(obj) {
    const model = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(obj, model);
}

module.exports.Customer = Customer;
exports.validate = validate;
