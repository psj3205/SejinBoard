module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    console.log('/ 패스 요청됨.');
    console.log(req.user);
    res.render('mainpage.ejs', { user: req.user });
  });

  app.get('/login', (req, res) => {
    console.log('/login 패스 요청됨.');
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', function (err, user, info) {
      let redirectUrl = '';
      if (!user) return res.redirect('/login');
      req.logIn(user, function (err) {
        if (err) return next(err); 
        redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
      })
    })(req, res, next);
  });


  app.get('/signup', (req, res) => {
    console.log('/signup 패스 요청됨.');
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
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
  app.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', function (err, user, info) {
      let redirectUrl = '';
      if (!user) return res.redirect('/login');
      req.logIn(user, function (err) {
        if (err) return next(err); 
        redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
      })
    })(req, res, next);
  });

  app.get('/auth/kakao', passport.authenticate('login-kakao'));
  app.get('/oauth', (req, res, next) => {
    passport.authenticate('login-kakao', function (err, user, info) {
      let redirectUrl = '';
      if (!user) return res.redirect('/login');
      req.logIn(user, function (err) {
        if (err) return next(err); 
        redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
      })
    })(req, res, next);
  });

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
  }));
  app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', function (err, user, info) {
      let redirectUrl = '';
      if (!user) return res.redirect('/login');
      req.logIn(user, function (err) {
        if (err) return next(err); 
        redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
      })
    })(req, res, next);
  });

  app.get('/auth/naver', passport.authenticate('naver'));
  app.get('/auth/naver/callback', (req, res, next) => {
    passport.authenticate('naver', function (err, user, info) {
      let redirectUrl = '';
      if (!user) return res.redirect('/login');
      req.logIn(user, function (err) {
        if (err) return next(err); 
        redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
      })
    })(req, res, next);
  });
}