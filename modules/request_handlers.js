/**
 * Created by Kevin on 2016/05/05.
 */
// 存储route配置对象
var routeObj;

function handleValidRequest(request, response, responseType, innerHtml) {
    var fs = require('fs');
    var realpath = './response_template/response_' + responseType + '.json';

    fs.exists(realpath, function (exists) {
        if (exists) {
            fs.readFile(realpath, function (err, data) {
                if (err) {
                    handleErrorOutput(request, response, 400, 'Response file read error!')
                } else {
                    handleSuccessOutput(request, response, data, innerHtml);
                }
            });
        } else {
            handleErrorOutput(request, response, 400, 'Response file not found!');
        }
    });
}

function isRequestSupportGzip(request) {
    // 判断客户端是否支持gzip的encoding
    var acceptEncodingHeader = request.headers['accept-encoding'];
    var isAcceptEncoding = acceptEncodingHeader && acceptEncodingHeader.indexOf('gzip') != -1;
    return isAcceptEncoding;
}

function handleErrorOutput(request, response, errorCode, errorMessage) {
    response.writeHead(errorCode, {'Content-Type:': 'text/plain'});
    response.write('HTTP ' + errorCode + '/' + errorMessage);
    response.end();
}

function handleSuccessOutput(request, response, data, innerHtml) {
    if (innerHtml) {
        var fs = require('fs');
        var htmlPath = './response_template/html_template/html_' + innerHtml + '.html';
        var htmlData = fs.readFileSync(htmlPath, 'utf-8');

        var jsonData = JSON.parse(data);
        jsonData['content']['html'] = htmlData;

        data = JSON.stringify(jsonData);
    }

    // gzip压缩输出内容
    if (isRequestSupportGzip(request)) {
        var zlib = require('zlib');

        response.setHeader('Content-Encoding', 'gzip');
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(zlib.gzipSync(data));
    } else {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(data);
    }
    response.end();
}

/**
 * 请求处理入口。
 */
function handleRequests(parsedUrl, request, response) {
    // 解码并解析querystring
    //var queryStringUtil = require('querystring');
    //var queryString = parsedUrl.query;
    //var queryStringResultObject = queryStringUtil.parse(queryString);

    var pathname = parsedUrl.pathname;

    // 第一种处理方式
    //var templateName;
    //var innerHtml;
    //if (pathname == '/sample_app/focus_pic') {
    //   templateName = 'focus_pic';
    //} else if (pathname == '/sample_app/article_list') {
    //    templateName = 'article_list';
    //} else if (pathname == '/sample_app/article_detail') {
    //    templateName = 'article_detail';
    //    innerHtml = 'article';
    //}
    //
    //if (templateName) {
    //    handleValidRequest(request, response, templateName, innerHtml);
    //} else {
    //    handleErrorOutput(request, response, 400, 'Invalid request url!');
    //}



    // 解析route配置信息
    if (!routeObj) {
        var fs = require('fs');
        var propertiesPath = './appProperties.json';
        var propertiesData = fs.readFileSync(propertiesPath, 'utf-8');

        routeObj = JSON.parse(propertiesData);
    }

    var templateObj = routeObj['route'][pathname];
    if (templateObj) {
        handleValidRequest(request, response, templateObj['template'], templateObj['inner_html']);
    } else {
        handleErrorOutput(request, response, 400, 'Invalid request url!');
    }


    //if (templateName) {
    //    handleValidRequest(request, response, templateName, innerHtml);
    //} else {
    //    handleErrorOutput(request, response, 400, 'Invalid request url!');
    //}
}

exports.handleRequests = handleRequests;