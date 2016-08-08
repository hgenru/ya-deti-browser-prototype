// var path = require('path');
var http = require('http');
var bunyan = require('bunyan');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var PORT = process.env.PORT || 8080;

var log = bunyan.createLogger({
    name: 'ya-deti'
    // streams: [
    //     {
    //         level: 'info',
    //         stream: path.resolve(__dirname, 'logs/log')
    //     },
    //     {
    //         level: 'error',
    //         path: path.resolve(__dirname, 'logs/log')
    //     }
    // ]
});

var serve = serveStatic(
    __dirname + '/www',
    {index: 'index.html'});

var server = http.createServer(function onRequest(req, res) {
    log.info(req.url);
    serve(req, res, finalhandler(req, res));
});
log.info(`APP START ON ${PORT}`);
server.listen(PORT);
