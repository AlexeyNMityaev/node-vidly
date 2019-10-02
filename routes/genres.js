const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');
const { Genre, validate } = require('../models/genre');

router.get('/', asyncMiddleware(async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);
    // Genre.find().sort('name')
    //     .then((genres) => res.send(genres))
    //     .catch((error) => {
    //         for(field in error.errors) {
    //             console.log(error.errors[field].message);
    //         }
    //     });
}));

router.get('/:id', validateObjectId, async (req, res) => {
    let genre = await Genre.findById(req.params.id);
    if(!genre) {
        return res.status(404).send('404 Not Found');
    }
    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    let {error} = validate(req.body);
    if(error) {
        return res.status(400).send(error);
    }

    let genre = new Genre({
        name: req.body.name
    });
    genre = await genre.save();
    res.send(genre);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
    let {error} = validate(req.body);
    if(error) {
        return res.status(400).send(error);
    }

    let genre = await Genre.findById(req.params.id);
    if(!genre) {
        return res.status(404).send('404 Not Found');
    }
    genre.name = req.body.name;
    genre = await genre.save();
    res.send(genre);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    let genre = await Genre.findOneAndDelete({ _id: req.params.id });
    if(!genre) {
        return res.status(404).send('404 Not Found');
    }
    res.send(genre);
});

module.exports = router;
