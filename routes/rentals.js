const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort('-dateOut');
        res.send(rentals);
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

    let customer = await Customer.findById(req.body.customerId);
    if(!customer) {
        return res.status(400).send('Invalid customer');
    }
    let movie = await Movie.findById(req.body.movieId);
    if(!movie) {
        return res.status(400).send('Invalid movie');
    }

    if(movie.numberInStock === 0) {
        return res.status(400).send('Movie is not in stock');
    }

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
        res.send(rental);
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
