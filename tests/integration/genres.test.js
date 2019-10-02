let server;
const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
        await Genre.remove({});
        await server.close();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return one genre', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if genre not found', async () => {
            const id = new mongoose.Types.ObjectId().toHexString();
            
            const res = await request(server).get(`/api/genres/${id}`);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        // Define the happy path and then in each test change one parameter that clearly aligns with the name of the test
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                            .post('/api/genres/')
                            .set('x-auth-token', token)
                            .send({ name });
        };
        
        beforeEach(() => {
            token = new User().getAuthToken();
            name = 'genre1';
        });

        it('should return 401 if user is not authorized', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should create genre if it is valid', async () => {
            const res = await exec();
            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should retun genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {

        // Define the happy path and then in each test change one parameter that clearly aligns with the name of the test
        let token;
        let name;
        let genre;

        const exec = async () => {
            return await request(server)
                            .put('/api/genres/' + genre._id)
                            .set('x-auth-token', token)
                            .send({ name });
        };
        
        beforeEach(async () => {
            token = new User().getAuthToken();
            name = 'genre1';
            genre = new Genre({ name });
            await genre.save();
        });

        it('should return 401 if user is not authorized', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if genre is not found', async () => {
            genre._id = new mongoose.Types.ObjectId().toHexString();
            
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should update genre if it is valid', async () => {
            name = 'genre2';
            const res = await exec();
            const genre = await Genre.find({ name: 'genre2' });

            expect(genre).not.toBeNull();
        });

        it('should update and retun genre if it is valid', async () => {
            name = 'genre2';
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre2');
        });
    });

    describe('DELETE /:id', () => {

        let token;
        let genre = {};

        const exec = async () => {
            return await request(server)
                            .delete('/api/genres/' + genre._id)
                            .set('x-auth-token', token)
                            .send();
        };
        
        beforeEach(async () => {
            token = new User({ isAdmin: true }).getAuthToken();
            genre = new Genre({ name: 'genre1' });
            await genre.save();
        });

        it('should return 401 if user is not authorized', async () => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).getAuthToken(); 
            const res = await exec();
      
            expect(res.status).toBe(403);
        });

        it('should return 404 if genre is not found', async () => {
            genre._id = new mongoose.Types.ObjectId().toHexString();
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return genre and delete it', async () => {
            const res = await exec();
            const tempGenre = await Genre.findById(genre._id);

            expect(tempGenre).toBeNull();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});
