const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');
let { Rental } = require('../../models/rental');
let { User } = require('../../models/user');
let { Movie } = require('../../models/movie');
let { Genre } = require('../../models/genre');
let server;

describe('/api/returns', () => {
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    };

    beforeEach(async () => { 
        server = require('../../index'); 

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().getAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            genre: new Genre({
                name: '12345'
            }),
            numberInStock: 2,
            dailyRentalRate: 2
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    afterEach(async () => { 
        await Rental.remove({});
        await Movie.remove({});
        await server.close();
    });

    describe('POST /', () => {
        it('should return 401 if user is not authorized', async () => {
            token = '';
            let res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if cutomerId is not provided', async () => {
            customerId = '';
            let res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if movieId is not provided', async () => {
            movieId = '';
            let res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404 if rental for customerId/movieId is not found', async () => {
            customerId = mongoose.Types.ObjectId().toHexString();
            movieId = mongoose.Types.ObjectId().toHexString();
            let res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 400 if rental is already processed', async () => {
            rental.dateReturned = new Date();
            await rental.save();
            let res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 200 if request is valid', async () => {
            let res = await exec();
            expect(res.status).toBe(200);
        });

        it('should set return date for rental', async () => {
            let res = await exec();
            let diff = Date.now() - new Date(res.body.dateReturned).getTime();
            expect(diff).toBeLessThan(10 * 1000);
        });

        it('should calculate the rental fee', async () => {
            rental.dateOut = moment().add(-7, 'days').toDate();
            await rental.save();

            let res = await exec();
            // let fee = Math.round((new Date(res.body.dateReturned).getTime() - new Date(res.body.dateOut).getTime()) / (1000 * 60 * 60 * 24)) * res.body.movie.dailyRentalRate;
            expect(res.body.rentalFee).toEqual(7 * res.body.movie.dailyRentalRate);
        });

        it('should increase the movie stock ', async () => {
            let res = await exec();
            let movieInDb = await Movie.findById(movieId);
            expect(movieInDb.numberInStock).toBe(++movie.numberInStock);
        });

        it('should return the rental', async () => {
            let res = await exec();
            let rentalInDb = await Rental.findById(rental._id);
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'customer', 'movie', 'rentalFee']));
        });
    });
});