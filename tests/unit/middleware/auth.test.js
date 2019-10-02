const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        let user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        let token = new User(user).getAuthToken();
        let req = {
            header: jest.fn().mockReturnValue(token)
        };
        let res = {};
        let next = jest.fn();
        
        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});