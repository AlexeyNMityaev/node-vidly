let server;
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
        await Genre.remove({});
        server.close();
    });

    let token;

    const exec = () => {
        return request(server)
                        .post('/api/genres/')
                        .set('x-auth-token', token)
                        .send({ name: 'genre1' });
    };

    beforeEach(() => {
        token = new User().getAuthToken();
    });

    it('should return 401 if user is not authorized', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is not valid', async () => {
        token = 'a';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});