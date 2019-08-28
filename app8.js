var express = require('express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');

var app = express();

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

var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const user = require('./routes/user');

var database;
let UserSchema;
let UserModel;

var connectDB = () => {
    var databaseUrl = 'mongodb://localhost:27017/shopping';
    // mongoose 모듈을 사용하여 데이터데비스에 연결할 경우//////////////////////////////////////
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', () => {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        createUserSchema();
    });
    database.on('disconnected', connectDB);
};

var router = express.Router();

router.route('/process/login').post(user.login);

router.route('/process/adduser').post(user.adduser);

router.route('/process/listuser').post(user.listuser);

app.use('/', router);

var errorHandler = expressErrorHandler({
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
    UserSchema = require('./database/user_schema');

    UserModel = mongoose.model('users', UserSchema.createSchema(mongoose));
    console.log('UserModel 정의함');

    user.init(database, UserSchema, UserModel);
};