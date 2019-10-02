const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validator = require('../middleware/validator');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');

router.post('/', [auth, validator(validate)], async (req, res) => {
    let rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if(!rental) {
        return res.status(404).send('404 Not Found');
    }
    if(rental.dateReturned) {
        return res.status(400).send('400 Rental Is Already Processed');
    }
    
    rental.return();
    await rental.save();

    await Movie.update({ _id: req.body.movieId }, { $inc: { numberInStock: 1 } });
    // rental.rentalFee = Math.round((new Date(rental.dateReturned).getTime() - new Date(rental.dateOut).getTime()) / (1000 * 60 * 60 * 24)) * rental.movie.dailyRentalRate;
    
    res.send(rental);
});

module.exports = router;
