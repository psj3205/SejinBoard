module.exports = (app, passport) => {
    app.get('/', (req, res) => {
        console.log('/ 패스 요청됨.');
        res.render('index.ejs');
    });

    app.get('/login', (req, res) => {
        console.log('/login 패스 요청됨.');
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', (req, res) => {
        console.log('/signup 패스 요청됨.');
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', (req, res) => {
        console.log('/profile 패스 요청됨.');

        console.log('req.user 객체의 값');
        console.dir(req.user);

        if (!req.user) {
            console.log('사용자 인증이 안 된 상태임.');
            res.redirect('/');
            return;
        }

        console.log('사용자 인증된 상태임.');
        if (Array.isArray(req.user)) {
            res.render('profile.ejs', { user: req.user[0]._doc });
        }
        else {
            res.render('profile.ejs', { user: req.user });
        }
    });

    app.get('/logout', (req, res) => {
        console.log('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));
}