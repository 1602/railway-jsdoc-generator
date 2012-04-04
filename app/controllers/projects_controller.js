var path = require('path');
var fs = require('fs');

load('application');

before(use('requireUser'), {only: 'whoami'});

action(function whoami() {
    redirect('/' + req.user.username);
});

action(function index() {
    var user = this.user = req.params.user;
    this.title = user + "'s projects";
    User.projectsWithStats(user, function (err, projects) {
        render({ projects: projects });
    });
});

action(function recent() {
    ProjectStatsHistory.all({
        limit: 5,
        order: 'id DESC'
    }, function (err, projects) {
        send(projects);
    });
});

