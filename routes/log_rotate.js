const winston = require('winston');
const { combine, timestamp } = winston.format;
require('winston-daily-rotate-file');
const {format} = require("winston");
const LOG_PARAM_SEPARATE = ';';
const HEADER_SIZE = 7;

const transport = new winston.transports.DailyRotateFile({
    filename: 'piratera-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '30m',
    maxFiles: '60d',
    dirname: './user-log'
});

const myFormat = format.printf(({ message, timestamp }) => {
    const {header, params} = message;
    const infos = header.split(LOG_PARAM_SEPARATE);
    const type = infos.shift();
    const userInfo = infos.join(LOG_PARAM_SEPARATE);
    if (params != null) {
        return `${type.trim()} [${timestamp}] ${userInfo.trim()}:${params.trim()}`;
    } else {
        return `${type.trim()} [${timestamp}] ${userInfo.trim()}`;
    }

});


const logger = winston.createLogger({
    format: combine(
        timestamp({format: 'HH:mm:ss'}),
        myFormat
    ),
    transports: [
        transport
    ]
});


const logRoute = function (app) {
    app.post('/log', (req, res) => {
        if (req.body == null || req.body.header == null) {
            res.send("HEADER MISSING!");

        } else if (req.body.header.split(LOG_PARAM_SEPARATE).length < HEADER_SIZE) {
            res.send(`HEADER MISSING! SIZE=${req.body.header.split(LOG_PARAM_SEPARATE)}`);
        }
        try {
            logger.info(req.body);
            res.send('Send log success');
        } catch (e) {
            req.error(e.message);
        }
    });
}

// this line is unchanged
module.exports = logRoute;
