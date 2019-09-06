const kakaoStrategy = require('passport-kakao').Strategy;
const config = require('../config');

module.exports = (app, passport) => {
    console.log('kakao outh 실행');
    return new kakaoStrategy({
        clientID: config.kakao.clientID,
        callbackURL: config.kakao.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        console.log('passport의 kakao 호출됨.');
        console.log(profile);

        const options = {
            criteria: { 'id': profile.id }
        };

        const database = app.get('database');
        database.UserModel.load(options, (err, user) => {
            if (err) return done(err);
            if (!user) {
                const user = new database.UserModel({
                    name: profile.displayName,
                    email: profile._json.kaccount_email,
                    provider: 'kakao',
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
        // return done(null, profile);
    });
};