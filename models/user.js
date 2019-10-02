const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true
    },
    isAdmin: Boolean
});

userSchema.methods.getAuthToken = function() {
    let token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateToken'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validate(obj) {
    const model = {
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(obj, model);
}

module.exports.User = User;
exports.validate = validate;
