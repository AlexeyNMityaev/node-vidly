const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { User, validate } = require('../models/user');

router.post('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if(!user) {
        return res.status(404).send('Not Found');
    }
    res.send(user);
});

router.post('/', async (req, res) => {
    let {error} = validate(req.body);
    if(error) {
        return res.status(400).send(error);
    }

    
    try {
        let user = await User.findOne({ email: req.body.email });
        if(user) {
            return res.status(400).send('Email already taken');
        }

        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();
        let token = user.getAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
