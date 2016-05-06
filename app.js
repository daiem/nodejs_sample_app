/**
 * Created by Kevin on 2016/05/05.
 */
var server = require('./modules/server');
var router = require('./modules/router');
var requestHandlers = require('./modules/request_handlers');

server.start(router.route, requestHandlers.handleRequests);