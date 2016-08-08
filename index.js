let path = require('path');
let http = require('http');
let bunyan = require('bunyan');
let finalhandler = require('finalhandler');
let serveStatic = require('serve-static');

const PORT = process.env.PORT || 8080;

let log = bunyan.createLogger({
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

let serve = serveStatic(
    path.resolve(__dirname, 'www'),
    {index: 'index.html'});

let server = http.createServer(function onRequest(req, res) {
    log.info(req.url);
    serve(req, res, finalhandler(req, res));
});
log.info(`APP START ON ${PORT}`);
server.listen(PORT);
