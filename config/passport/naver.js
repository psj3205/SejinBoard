const NaverStrategy = require('passport-naver').Strategy;
const config = require('../config');

module.exports = (app, passport) => {
    console.log('naver outh 실행');
    return new NaverStrategy({
        clientID: config.naver.clientID,
        clientSecret: config.naver.clientSecret,
        callbackURL: config.naver.callbackURL,
    }, (accessToken, refreshToken, profile, done) => {
        console.log('passport의 naver 호출됨.');
        console.dir(profile);

        const options = {
            criteria: { 'id': profile.id }
        };

        const database = app.get('database');
        database.UserModel.load(options, (err, user) => {
            if (err) return done(err);
            if (!user) {
                const user = new database.UserModel({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'naver',
                    id: profile.id
                });

                user.save((err) => {
                    if (err) console.log(err);
                    return done(err, user);
                });
            }
            else {
                return done(err, user);
            }
        });
    });
};