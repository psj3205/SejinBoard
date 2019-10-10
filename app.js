const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const static = require('serve-static');
const config = require('./config/config');
const expressErrorHandler = require('express-error-handler');
const expressSession = require('express-session');
const cors = require('cors');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();

console.log(`config.server_port : ${config.server_port}`);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const route_loader = require('./routes/route_loader');
route_loader.init(app);

const configPassport = require('./config/passport');
configPassport(app, passport);

const userPassport = require('./routes/user_passport');
userPassport(app, passport);

const errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), () => {
  console.log('서버가 시작되었습니다. 포트: ' + app.get('port'));
});