const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('getAuthToken', () => {
    it('should send a valid jwt', () => {
        let payload = { _id: new mongoose.Types.ObjectId().toHexString() };
        let user = new User(payload);
        let token = user.getAuthToken();
        
        expect(jwt.verify(token, config.get('jwtPrivateToken'))).toMatchObject({ _id: payload._id });
    });
});