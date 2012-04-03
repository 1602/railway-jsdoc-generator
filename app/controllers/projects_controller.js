var path = require('path');
var fs = require('fs');

load('application');

before(use('requireUser'), {only: 'whoami'});

action(function whoami() {
    redirect('/' + req.user.username);
});

action(function index() {
    User.projects(req.params.user, function (err, projects) {
        if (projects) {
            var pros = [];
            projects.forEach && projects.forEach(function (project) {
                var projPath = req.params.user + '/' + project.name;
                var projectStatsFile = app.root + '/public/' + projPath + '/stats.json';
                if (project.language === 'JavaScript') {
                    project.path = '/' + projPath;
                    if (path.existsSync(projectStatsFile)) {
                        project.stats = JSON.parse(fs.readFileSync(projectStatsFile).toString());
                    }
                    pros.push(project);
                }
            });
            render({
                title: req.params.user + "'s projects",
                projects: pros.sort(byWatchers)
            });
        }
    });

    function byWatchers(p1, p2) {
        return p2.watchers - p1.watchers;
    }
});

