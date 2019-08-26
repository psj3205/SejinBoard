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
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

var crypto = require('crypto');

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
    /////////////////////////////////////////////////////////////////////////////////////////

    // mongodb 모듈을 사용하여 데이터베이스에 연결할 경우///////////////////////////////////////
    // MongoClient.connect(databaseUrl, (err, db) => {
    //     if (err) throw err;

    //     console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
    //     console.log("connected:" + db);
    //     //mongodb 버전 3.0이상을 사용할 때는, connection을 할 때에 database명을 명시해야 한다
    //     database = db.db('shopping');
    // });
    /////////////////////////////////////////////////////////////////////////////////////////
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

router.route('/process/adduser').post((req, res) => {
    console.log('/process/adduser 호출됨.');

    var paramId = req.body.id;
    var paramPassword = req.body.password;
    var parmaName = req.body.name;

    if (database) {
        addUser(database, paramId, paramPassword, parmaName, (err, result) => {
            if (err) throw err;
            if (result) {
                console.dir(result);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/htn=ml;charset=utf8' });
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    }
    else {
        res.writeHead('200', { 'Content-type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

router.route('/process/listuser').post((req, res) => {
    console.log('/process/listuser 호출됨.');

    if (database) {
        UserModel.findAll((err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (results) {
                // console.dir(results);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트</h2>');
                res.write('<div><ul>');
                for (var i = 0; i < results.length; i++) {
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write('<li>#' + i + ':' + curId + ', ' + curName + '</li>');
                }

                res.write('</ul></div>');
                res.end();
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트 조회 실패</h2>');
                res.end();
            }
        });
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

    // mongoose 모듈을 사용하여 사용자를 인증할 경우//////////////////////////////////////
    UserModel.findById(id, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);

        if (results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음.');

            var user = new UserModel({ id: id });
            var authenticated = user.authenticate(password, results[0]._doc.salt,
                results[0]._doc.hashed_password);

            if (authenticated) {
                console.log('비밀번호 일치함');
                callback(null, results);
            }
            else {
                console.log('비밀번호 일치하지 않음.');
                callback(null, null);
            }
        }
        else {
            console.log('아이디와 일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    });

    // UserModel.find({ "id": id, "password": password }, (err, results) => {
    //     if (err) {
    //         callback(err, null);
    //         return;
    //     }

    //     console.log('아이디 [%s], 비밀번호 [%s]로 사용자 검색 결과', id, password);
    //     console.dir(results);

    //     if (results.length > 0) {
    //         console.log('일치하는 사용자 찾음.', id, password);
    //         callback(null, results);
    //     }
    //     else {
    //         console.log('일치하는 사용자를 찾지 못함.');
    //         callback(null, null);
    //     }
    // });
    ///////////////////////////////////////////////////////////////////////////////////

    // mongodb 모듈을 사용하여 사용자를 인증할 경우//////////////////////////////////////
    // var users = database.collection('users');
    // console.log(users);
    // users.find({ "id": id, "password": password }).toArray((err, docs) => {
    //     if (err) {
    //         callback(err, null);
    //         return;
    //     }
    //     if (docs.length > 0) {
    //         console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음.', id, password);
    //         callback(null, docs);
    //     }
    //     else {
    //         console.log('일치하는 사용자를 찾지 못함.');
    //         callback(null, null);
    //     }
    // });
    ///////////////////////////////////////////////////////////////////////////////////
};

var addUser = (database, id, password, name, callback) => {
    console.log('addUser 호출됨.');

    // mongoose 모듈을 사용하여 사용자를 추가할 경우//////////////////////////////////////
    var user = new UserModel({ "id": id, "password": password, "name": name });

    user.save((err) => {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('사용자 데이터 추가함.');
        callback(null, user);
    });
    ///////////////////////////////////////////////////////////////////////////////////

    // mongodb 모듈을 사용하여 사용자를 추가할 경우///////////////////////////////////////
    // var users = database.collection('users');
    // users.insert([{ "id": id, "password": password, "name": name }], (err, result) => {
    //     if (err) {
    //         callback(err, null);
    //         return;
    //     }
    //     console.log('사용자 데이터 추가함.');
    //     callback(null, result);
    // });
    ////////////////////////////////////////////////////////////////////////////////////
};

var createUserSchema = () => {
    UserSchema = mongoose.Schema({
        id: { type: String, required: true, unique: true, 'default': ' ' },
        hashed_password: { type: String, required: true, 'default': ' ' },
        salt: { type: String, required: true },
        name: { type: String, index: 'hashed', 'default': ' ' },
        age: { type: Number, 'default': -1 },
        created_at: { type: Date, index: { unique: false }, 'default': Date.now },
        updated_at: { type: Date, index: { unique: false }, 'default': Date.now }
    });

    UserSchema.static('findById', function (id, callback) { return this.find({ id: id }, callback); });
    UserSchema.static('findAll', function (callback) {
        console.log(this);
        return this.find({}, callback);
    });

    UserSchema
        .virtual('password')
        .set(function (password) {
            this._password = password;
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
            console.log('virtual password 호출됨 : ' + this.hashed_password);
        })
        .get(function () { return this._password });

    UserSchema.method('encryptPassword', function (plainText, inSalt) {
        if (inSalt) {
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }
        else {
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });

    UserSchema.method('makeSalt', () => {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    UserSchema.method('authenticate', function (plainText, inSalt, hashed_password) {
        if (inSalt) {
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText,
                this.encryptPassword(plainText, inSalt), hashed_password);
            return this.encryptPassword(plainText, inSalt) === hashed_password;
        }
        else {
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText,
                this.encryptPassword(plainText), this.hashed_password);
            return this.encryptPassword(plainText) === this.hashed_password;
        }
    });

    UserSchema.path('id').validate(id => id.length, 'id 칼럼의 값이 없습니다.');
    UserSchema.path('name').validate(name => name.length, 'name 칼럼의 값이 없습니다.');

    console.log('UserSchema 정의함.');

    UserModel = mongoose.model('users', UserSchema);
    console.log('UserModel 정의함');
};