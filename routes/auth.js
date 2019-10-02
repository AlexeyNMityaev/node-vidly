const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/user');

router.post('/', async (req, res) => {
    let {error} = validate(req.body);
    if(error) {
        return res.status(400).send(error);
    }
    
    try {
        let user = await User.findOne({ email: req.body.email });
        if(!user) {
            return res.status(400).send('Invalid email or password');
        }

        let validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) {
            return res.status(400).send('Invalid email or password');
        }

        let token = user.getAuthToken();
        res.send(token);
    } catch (error) {
        for(field in error.errors) {
            console.log(error.errors[field].message);
        }
    }
});

function validate(obj) {
    const model = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(obj, model);
}

module.exports = router;
