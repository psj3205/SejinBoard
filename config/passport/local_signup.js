const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  const paramName = req.body.name || req.query.name;
  console.log(`passport의 local-signup 호출됨 : ${email}, ${password}, ${paramName}`);

  process.nextTick(() => {
    const database = req.app.get('database');
    database.UserModel.findOne({ 'email': email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (user) {
        console.log('기존에 계정이 있음');
        return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
      } else {
        const user = new database.UserModel({ 'email': email, 'password': password, 'name': paramName });
        user.save((err) => {
          if (err) { throw err; }
          console.log('사용자 데이터 추가함.');
          return done(null, user);
        });
      }
    });
  });
});
