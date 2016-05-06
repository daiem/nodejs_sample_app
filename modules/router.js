/**
 * Created by Kevin on 2016/05/05.
 */
// 针对不同的请求，做出不同的相应
function route(handler, parsedUrl, request, response) {
    var pathname = parsedUrl.pathname;
    console.log('About to route a request for ' + pathname);

    // 禁止访问favicon.ico
    if (!pathname.indexOf('/favicon.ico')) {
        return;
    }

    // 这里不用检查请求路径是否正确，将路由放到handle对应的函数中去
    handler(parsedUrl, request, response);
}

exports.route = route;