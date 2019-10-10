const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../config');

module.exports = (app, passport) => {
  console.log('google outh 실행');
  return new googleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  }, (accessToken, refreshToken, profile, done) => {
    console.log('passport의 google 호출됨.');
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
          provider: 'google',
          id: profile.id
        });

        user.save((err) => {
          if (err) console.log(err);
          return done(err, user);
        })
      }
      else {
        return done(err, user);
      }
    })

    // return done(null, profile);
  })
};