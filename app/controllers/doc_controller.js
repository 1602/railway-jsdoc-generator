var fs = require('fs');
var path = require('path');
var Project = require('makedoc').Project;

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
    var p = new Project;
    p.title = params.repo;
    p.repo = git;
    p.out = app.root + '/public/' + git + '/';
    p.layoutHTML = fs.readFileSync(app.root + '/app/views/layouts/doc_layout.html').toString();

    if (!path.existsSync(app.root + '/public/' + git)) {
        fs.mkdirSync(app.root + '/public/' + git);
    } else {
        return setTimeout(function () {
            redirect('/' + git + '/');
        }, 1000);
    }

    p.download('lib', function () {
        p.makeDocumentation();
        // makePic(git);
        redirect('/' + git + '/');
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

    var p = new Project;
    p.title = params.repo;
    p.repo = git;
    p.out = app.root + '/public/' + git + '/';
    p.layoutHTML = getDocLayout();
    p.download('lib', function () {
        p.makeDocumentation();
        if (req.params.format === 'json') {
            redirect('/' + git + '/stats.json');
            // send(fs.readFileSync(app.root + '/public/' + git + '/stats.json'));
        } else {
            redirect('/' + git);
        }
        // makePic(git);
    });
});

function getDocLayout() {
    return fs.readFileSync(app.root + '/app/views/layouts/doc_layout.html')
    .toString()
    .replace(/PROJECT OWNER/g, params.user)
    .replace(/PROJECT NAME/g, params.repo);
}

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

