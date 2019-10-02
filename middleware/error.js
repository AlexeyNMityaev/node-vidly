const { logger } = require('../startup/logging');

module.exports = function(error, req, res, next) {
    logger.error(error.message, error);
    // for(field in error.errors) {
    //     logger.error(error.errors[field].message, error.errors[field])
    //     console.log(error.errors[field].message);
    // }
    res.status(500).send('Internal server error');
}
