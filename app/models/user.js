var https = require('https');

User.findOrCreate = function (data, done) {

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

User.prototype.projects = function (cb) {
    var req = https.get({
        host: 'api.github.com',
        path: '/users/' + this.username + '/repos'
    }, function (res) {
        var data = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var repos = JSON.parse(data);
            cb(null, repos);
        });

    });
    req.on('error', function (err) {
        cb(new Error('Can not get list of repos for user' + this.username));
    });
};
