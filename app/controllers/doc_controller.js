var fs = require('fs');
var path = require('path');
var Module = require('module')

load('application');

action('make', function () {
    Module._cache = {};
    var md = require('makedoc');
    var git = params.user + '/' + params.repo;

    if (!path.existsSync(app.root + '/public/' + params.user)) {
        fs.mkdirSync(app.root + '/public/' + params.user);
    }

    if (!path.existsSync(app.root + '/public/' + git)) {
        fs.mkdirSync(app.root + '/public/' + git);
    } else {
        return setTimeout(function () {
            redirect('/' + git + '/');
        }, 1000);
    }

    md.download('/' + git + '/tree/master/lib', function (files, readme) {
        files.forEach(generate);
        md.writeReadme(
            app.root + '/public/' + git + '/index.html',
            readme,
            {title: params.repo}
        );
        redirect('/' + git + '/index.html');
    });

    function generate(file) {
        md.generateFile(file, {
            out: app.root + '/public/' + git + '/',
            git: git
        });
    }
});

