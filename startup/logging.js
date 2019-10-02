const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'logger.log' }),
        new winston.transports.Console({ format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ) }),
        new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'error' }),
    ],
    exceptionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'uncaughtException.log' })
    ]
});

function startLogging() {
    // logger.exceptions.handle(
    //     new winston.transports.Console(),
    //     new winston.transports.File({ filename: 'uncaughtException.log' })
    // );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}

module.exports.logger = logger;
module.exports.startLogging = startLogging;
