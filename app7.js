var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');

var multer = require('multer');
var fs = require('fs');

var cors = require('cors');

// 익스프레스 객체 생성
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my-key',
    resave: true,
    saveUninitialized: true
}));
app.use(cors());

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});

var upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
});

var router = express.Router();

router.route('/process/photo').post(upload.array('photo'), (req, res) => {
    console.log('/process/photo 호출됨.');
    console.log(req.files);
    var files = req.files;

    var originalname = '',
        name = '',
        mimetype = '',
        size = 0;

    if (Array.isArray(files)) {
        console.log("배열에 들어있는 파일 개수 : %d", files.length);
        for (var index = 0; index < files.length; index++) {
            originalname = files[index].originalname;
            name = files[index].filename;
            mimetype = files[index].mimetype;
            size = files[index].size;
        }
    }
    else {
        console.log('파일 개수 : 1 ');
        originalname = files[index].originalname;
        name = files[index].name;
        mimetype = files[index].mimetype;
        size = files[index].size;
    }

    console.log('현재 파일 정보 : ' + originalname + ', '
        + name + ', ' + mimetype + ', ' + size);

    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h3>파일 업로드 성공</h3>');
    res.write('<hr>');
    res.write('<p>원본 파일 이름 : ' + originalname + '-> 저장 파일 이름 : ' + name + '</p>');
    res.write('<p>MIME TYPE : ' + mimetype + '</p>');
    res.write('<p>파일 크기 : ' + size + '</p>');
    res.end();
});

app.use('/', router);

http.createServer(app).listen(3000, () => {
    console.log('Express 서버가 3000번 포트에서 시작됨.');
})