var winston  = require('winston'),
    config = require('./config'),
    expressWinston = require('express-winston'),
    expressWinstonConfig,
    transports,
    errorTransports,
    logger;

transports = [
  new(winston.transports.Console)({
    colorize: true
  })
];

errorTransports = [
  new(winston.transports.Console)({
    colorize: true,
    json: true
  })
];

logger = new(winston.Logger)({
  exitOnError: false,
  transports: transports
});

expressWinstonConfig = {
  transports: transports,
  meta: !config.environment.isDev,
  msg: (config.environment.isDev) ? '{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}' : null
};

logger.expressRequestsLogger = expressWinston.logger(expressWinstonConfig);
logger.expressErrorLogger = expressWinston.errorLogger({ transports: errorTransports, dumpExceptions: true, showStack: true });


module.exports = logger;
