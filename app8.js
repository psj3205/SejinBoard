const express = require('express'),
    http = require('http'),
    path = require('path');

const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static');
//errorHandler = require('errorhandler');

const expressErrorHandler = require('express-error-handler');

const expressSession = require('express-session');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

const mongoose = require('mongoose');
const user = require('./routes/user');

const database = {};
const UserSchema = require('./database/user_schema');

const connectDB = () => {
    const databaseUrl = 'mongodb://localhost:27017/shopping';
    // mongoose 모듈을 사용하여 데이터데비스에 연결할 경우//////////////////////////////////////
    mongoose.connect(databaseUrl);
    database.connect = mongoose.connection;

    database.connect.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.connect.on('open', () => {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        createUserSchema();
    });
    database.connect.on('disconnected', connectDB);
};

const router = express.Router();

router.route('/process/login').post(user.login);
router.route('/process/adduser').post(user.adduser);
router.route('/process/listuser').post(user.listuser);

app.use('/', router);

const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), () => {
    console.log('서버가 시작되었습니다. 포트: ' + app.get('port'));

    // 데이터베이스 연결
    connectDB();
});

const createUserSchema = () => {
    const UserModel = mongoose.model('users', UserSchema.createSchema(mongoose));
    console.log('UserModel 정의함');

    user.init(database.connect, UserModel);
};