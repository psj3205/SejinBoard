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

var database;

var connectDB = () => {
    var databaseUrl = 'mongodb://localhost:27017/local';

    MongoClient.connect(databaseUrl, (err, db) => {
        if (err) throw err;

        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        console.log("connected:" + db);
        //mongodb 버전 3.0이상을 사용할 때는, connection을 할 때에 database명을 명시해야 한다
        database = db.db('local');
    });
};

var router = express.Router();

router.route('/process/login').post((req, res) => {
    console.log('/process/login 호출됨');

    var paramId = req.body.id;
    var paramPassword = req.body.password;

    if (database) {
        authUser(database, paramId, paramPassword, (err, docs) => {
            if (err) throw err;
            if (docs) {
                console.dir(docs);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 성공!</h1>');
                res.write(`<div><p>사용자 아이디 : ${paramId}</p></div>`);
                res.write(`<div><p>사용자 이름 : ${docs[0].name}</p></div>`);
                res.write(`<br><br><a href='/public/login.html'>다시 로그인 하기</a>`);
                res.end();
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오.</p></div>');
                res.write(`<br><br><a href='/public/login.html'>다시 로그인 하기</a>`);
                res.end();
            }
        });
    }
    else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

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

var authUser = (database, id, password, callback) => {
    console.log('authUser 호출됨');

    var users = database.collection('users');
    console.log(users);
    users.find({ "id": id, "password": password }).toArray((err, docs) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (docs.length > 0) {
            console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음.', id, password);
            callback(null, docs);
        }
        else {
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    });
};