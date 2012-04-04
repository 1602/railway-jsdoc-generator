var fs = require('fs');
var Project = require('makedoc').Project;

module.exports = Repository;

function Repository(git) {
    var g = git.split('/');
    this.repo = git;
    this.user = g[0];
    this.title = g[1];
};

Repository.prototype.generageDocumentation = function (cb) {
    var p = new Project;
    p.title = this.title;
    p.repo = this.repo;
    p.out = app.root + '/public/' + this.repo + '/';
    p.layoutHTML = this.getDocLayout();
    p.download('lib', function () {
        p.makeDocumentation();
        if (p.stats.coverage > 2) {
            ProjectStatsHistory.create({
                repo: p.repo,
                stats: JSON.stringify(p.stats),
                updatedAt: Date.now()
            });
        }
        cb(p.stats);
    });
};

Repository.prototype.getDocLayout = function getDocLayout() {
    return fs.readFileSync(app.root + '/app/views/layouts/doc_layout.html')
        .toString()
        .replace(/PROJECT OWNER/g, this.user)
        .replace(/PROJECT NAME/g, this.title);
};

