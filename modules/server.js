/**
 * Created by Kevin on 2016/05/05.
 */
var http = require('http');
var url = require('url');

function start(route, handle) {
    function onRequest(request, response) {
        // 获取请求路径
        var parsedUrl = url.parse(request.url);
        var pathname = parsedUrl.pathname;

        console.log('Request for ' + pathname + ' received.');

        route(handle, parsedUrl, request, response);
    }

    http.createServer(onRequest).listen(9999);
    console.log('Server has started.');
}

exports.start = start;