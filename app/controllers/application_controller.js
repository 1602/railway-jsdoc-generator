before('protect from forgery', function () {
    protectFromForgery('a46856f7077657a841273c73e03279866bbdaa0c');
});

publish(function requireUser() {
    if (!session.passport.user) {
        req.session.redirect = req.path;
        redirect('/auth/github');
    } else {
        User.find(session.passport.user, function (err, user) {
            req.user = user;
            next();
        });
    }
});

