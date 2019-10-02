const config = require('config');

module.exports = function() {
    if(!config.get('jwtPrivateToken')) {
        throw new Error('No jwtPrivateToken');
    }
}
