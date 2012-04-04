var fs = require('fs');
var path = require('path');

load('application');

before(function createUserDir() {
    if (!path.existsSync(app.root + '/public/' + params.user)) {
        fs.mkdirSync(app.root + '/public/' + params.user);
    }
    next();
});

skipBeforeFilter('protect from forgery');

action('make', function () {
    var git = params.user + '/' + params.repo;

    if (!path.existsSync(app.root + '/public/' + git)) {
        fs.mkdirSync(app.root + '/public/' + git);
    } else {
        return setTimeout(function () {
            redirect('/' + git + '/');
        }, 1000);
    }

    var r = new Repository(git);
    r.generageDocumentation(function (stats) {
        if (req.params.format === 'json') {
            send(stats);
        } else {
            redirect('/' + git + '/');
        }
    });
});

action('update', function () {
    var git = params.user + '/' + params.repo;
    var projectPath = app.root + '/public/' + git;
    if (!path.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
    }
    fs.readdirSync(projectPath).forEach(function (file) {
        fs.unlinkSync(projectPath + '/' + file);
    });

    var r = new Repository(git);
    r.generageDocumentation(function (stats) {
        if (req.params.format === 'json') {
            send(stats);
        } else {
            redirect('/' + git + '/');
        }
    });
});

function makePic(git) {
    var dirName = app.root + '/public/' + git;
    var data = require(dirName + '/stats.json');
    var Canvas = require('canvas')
    , canvas = new Canvas(89, 13)
    , ctx = canvas.getContext('2d')
    , fs = require('fs');

    var out = fs.createWriteStream(dirName + '/state.png')
    , stream = canvas.createPNGStream();

    ctx.fillStyle = '#bbb';
    ctx.fillRect(0,0,67,13);

    if (data.coverage < 50) {
        ctx.fillStyle = '#fbb';
    } else {
        ctx.fillStyle = '#bfb';
    }
    ctx.fillRect(67,0,22,13);

    ctx.fillStyle = '#000';
    ctx.font = '10px Impact';
    ctx.fillText("Docs coverage " + data.coverage + "%", 3, 10);

    stream.on('data', function(chunk){
        out.write(chunk);
    });
}

