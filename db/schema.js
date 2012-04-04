define('User', function () {
    property('githubId', String, { index: true });
    property('displayName');
    property('username');
    property('avatar');
});

define('ProjectStatsHistory', function () {
    property('repo');
    property('stats');
    property('updatedAt', Number);
});

