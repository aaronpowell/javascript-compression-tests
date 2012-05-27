var express = require('express'),
    server = express.createServer(),
    uglify = require('uglify-js'),
    parser = uglify.parser,
    pro = uglify.uglify,
    fn = __dirname + '/samples/jquery-1.7.2.js',
    fs = require('fs'),
    zlib = require('zlib');

server.get('/uncompressed/:gzip?', function (req, res) {
    fs.readFile(fn, function (err, data) {
        if (req.params.gzip) {
            zlib.gzip(data, function (err, result) {
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Content-Length', result.length);
                res.send(result, { 'Content-Type' : 'application/javascript' });
            });
        } else {
            res.send(data, { 'Content-Type' : 'application/javascript' });
        }
    });
});

server.get('/comment-stripped/:gzip?', function (req, res) {
    fs.readFile(fn, 'utf8', function (err, data) {
        var ast = parser.parse(data);
        var code = pro.gen_code(ast, { beautify: true });

        if (req.params.gzip) {
            zlib.gzip(code, function (err, result) {
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Content-Length', result.length);
                res.send(result, { 'Content-Type' : 'application/javascript' });
            });
        } else {
            res.send(code, { 'Content-Type' : 'application/javascript' });
        }
    });
});

server.get('/mangled/:gzip?', function (req, res) {
    fs.readFile(fn, 'utf8', function (err, data) {
        var ast = parser.parse(data);
        ast = pro.ast_mangle(ast);
        var code = pro.gen_code(ast, { beautify: true });

        if (req.params.gzip) {
            zlib.gzip(code, function (err, result) {
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Content-Length', result.length);
                res.send(result, { 'Content-Type' : 'application/javascript' });
            });
        } else {
            res.send(code, { 'Content-Type' : 'application/javascript' });
        }
    });
});

server.get('/squeezed/:gzip?', function (req, res) {
    fs.readFile(fn, 'utf8', function (err, data) {
        var ast = parser.parse(data);
        ast = pro.ast_mangle(ast);
        ast = pro.ast_squeeze(ast);

        var code = pro.gen_code(ast, { beautify: true });

        if (req.params.gzip) {
            zlib.gzip(code, function (err, result) {
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Content-Length', result.length);
                res.send(result, { 'Content-Type' : 'application/javascript' });
            });
        } else {
            res.send(code, { 'Content-Type' : 'application/javascript' });
        }
    });
});

server.get('/minified/:gzip?', function (req, res) {
    fs.readFile(fn, 'utf8', function (err, data) {
        var ast = parser.parse(data);
        ast = pro.ast_mangle(ast);
        ast = pro.ast_squeeze(ast);

        var code = pro.gen_code(ast);

        if (req.params.gzip) {
            zlib.gzip(code, function (err, result) {
                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Vary', 'Accept-Encoding');
                res.setHeader('Content-Length', result.length);
                res.send(result, { 'Content-Type' : 'application/javascript' });
            });
        } else {
            res.send(code, { 'Content-Type' : 'application/javascript' });
        }
    });
});

server.listen(process.env.PORT || 3000);
console.log('running');