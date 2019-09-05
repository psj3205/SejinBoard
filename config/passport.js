const local_login = require('./passport/local_login');
const local_signup = require('./passport/local_signup');
const facebook = require('./passport/facebook');

module.exports = (app, passport) => {
    console.log('config/passport 호출됨.');

    passport.serializeUser((user, done) => {
        console.log('serializeUser() 호출됨.');
        console.dir(user);

        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        console.log('deserializeUser() 호출됨.');
        console.dir(user);

        done(null, user);
    });

    passport.use('local-login', local_login);
    passport.use('local-signup', local_signup);
    passport.use('facebook', facebook(app, passport));
};