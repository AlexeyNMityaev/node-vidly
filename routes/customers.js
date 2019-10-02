const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { Customer, validate } = require('../models/customer');

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.send(customers);
    } catch (error) {
        for(field in error.errors) {
            console.log(error.errors[field].message);
        }
    }
});

router.get('/:id', async (req, res) => {
    try {
        let customer = await Customer.findById(req.params.id);
        if(!customer) {
            return res.status(404).send('404 Not Found');
        }
        res.send(customer);
    } catch (error) {
        for(field in error.errors) {
            console.log(error.errors[field].message);
        }
    }
});

router.post('/', auth, async (req, res) => {
    let {error} = validate(req.body);
    if(error) {
        return res.status(400).send(error);
    }

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    try {
        customer = await customer.save();
        res.send(customer);
    } catch (error) {
        for(field in error.errors) {
            console.log(error.errors[field].message);
        }
    }
});

router.put('/:id', auth, async (req, res) => {
    let {error} = validate(req.body);
    if(error) {
        return res.status(400).send(error);
    }
    try {
        let customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }, { new: true });
        if(!customer) {
            return res.status(404).send('404 Not Found');
        }
        
        res.send(customer);
    } catch (error) {
        for(field in error.errors) {
            console.log(error.errors[field].message);
        }
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        let customer = await Customer.findOneAndDelete({ _id: req.params.id });
        if(!customer) {
            return res.status(404).send('404 Not Found');
        }
        res.send(customer);
    } catch (error) {
        for(field in error.errors) {
            console.log(error.errors[field].message);
        }
    }
});

module.exports = router;
