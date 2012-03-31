define('User', function () {
    property('githubId', String, { index: true });
    property('displayName');
    property('username');
    property('avatar');
});

