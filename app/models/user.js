var path = require('path');
var fs = require('fs');
var https = require('https');

User.findOrCreate = function findOrCreate(data, done) {

    /* GITHUB */
    if (data.githubId) {
        User.all({
            where: {
                githubId: data.githubId
            }, limit: 1
        }, function (err, user) {
            if (user[0]) return done(err, user[0]);
            User.create({
                githubId: data.githubId,
                displayName: data.profile.displayName || data.profile.username,
                username: data.profile.username,
                avatar: data.profile._json.avatar_url
            }, done);
        });
    }

};

User.projects = function projects(username, cb) {
    if (User.projects._cache[username]) return cb(null, User.projects._cache[username]);
    var req = https.get({
        host: 'api.github.com',
        path: '/users/' + username + '/repos'
    }, function (res) {
        var data = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var repos = JSON.parse(data);
            User.projects._cache[username] = repos;
            cb(null, repos);
        });

    });
    req.on('error', function (err) {
        cb(new Error('Can not get list of repos for user' + username));
    });
};

User.projectsWithStats = function projectsWithStats(user, cb) {
    User.projects(user, function (err, projects) {
        var pros = [];
        projects.forEach && projects.forEach(function (project) {
            var projPath = user + '/' + project.name;
            var projectStatsFile = app.root + '/public/' + projPath + '/stats.json';
            if (project.language === 'JavaScript') {
                project.path = '/' + projPath;
                if (path.existsSync(projectStatsFile)) {
                    project.stats = JSON.parse(fs.readFileSync(projectStatsFile).toString());
                }
                pros.push(project);
            }
        });
        cb(err, pros.sort(byWatchers));
    });

    function byWatchers(p1, p2) {
        return p2.pushed_at > p1.pushed_at ? 1 : -1;
    }
};

User.projects._cache = {};

// clean cache each hour
setInterval(function () {
    User.projects._cache = {};
}, 3600000);

