const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.send(movies);
    } catch (error) {
        for(field in error.errors) {
            console.log(error.errors[field].message);
        }
    }
});

router.get('/:id', async (req, res) => {
    try {
        let movie = await Movie.findById(req.params.id);
        if(!movie) {
            return res.status(404).send('404 Not Found');
        }
        res.send(movie);
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

    let genre = await Genre.findById(req.body.genreId);
    if(!genre) {
        return res.status(400).send('Invalid genre');
    }

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    try {
        await movie.save();
        res.send(movie);
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
        let movie = await Movie.findById(req.params.id);
        if(!movie) {
            return res.status(404).send('404 Not Found');
        }

        let genre = await Genre.findById(req.body.genreId);
        if(!genre) {
            return res.status(400).send('Invalid genre');
        }
        
        movie.title = req.body.title;
        movie.genre = {
            _id: genre._id,
            name: genre.name
        };
        movie.numberInStock = req.body.numberInStock;
        movie.dailyRentalRate = req.body.dailyRentalRate;
        movie = await movie.save();
        res.send(movie);
    } catch (error) {
        for(field in error.errors) {
            console.log(error.errors[field].message);
        }
    }
});

router.delete('/:id',  auth, async (req, res) => {
    try {
        let movie = await Movie.findOneAndDelete({ _id: req.params.id });
        if(!movie) {
            return res.status(404).send('404 Not Found');
        }
        res.send(movie);
    } catch (error) {
        for(field in error.errors) {
            console.log(error.errors[field].message);
        }
    }
});

module.exports = router;
