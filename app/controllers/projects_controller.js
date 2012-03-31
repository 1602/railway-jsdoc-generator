var path = require('path');
var fs = require('fs');

load('application');

before(use('requireUser'));

action(function index() {
    console.log(app.models.Media);
    req.user.projects(function (err, projects) {
        if (projects) {
            var pros = [];
            projects.forEach(function (project) {
                var projPath = req.user.username + '/' + project.name;
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
                title: "My Projects",
                projects: pros.sort(byWatchers)
            });
        }
    });

    function byWatchers(p1, p2) {
        return p2.watchers - p1.watchers;
    }
});

