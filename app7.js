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
        callback(null, 'uploads/');
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

router.route('/process/photo').post(upload.array('photo', 1), (req, res) => {
    console.log('/process/photo 호출됨.');
    console.log(req.body);
    var paramId = req.body.id;
    var paramTime = req.body.time;
    var paramTextfield = req.body.textfield;
    var files = req.files;

    var originalname = '',
        name = '',
        mimetype = '',
        size = 0,
        path = '';

    if (Array.isArray(files)) {
        console.log("배열에 들어있는 파일 개수 : %d", files.length);
        for (var index = 0; index < files.length; index++) {
            originalname = files[index].originalname;
            name = files[index].filename;
            mimetype = files[index].mimetype;
            size = files[index].size;
            path = '/' + files[index].destination + name;
        }
    }
    else {
        console.log('파일 개수 : 1 ');
        originalname = files[index].originalname;
        name = files[index].name;
        mimetype = files[index].mimetype;
        size = files[index].size;
        path = '/' + files[index].destination + name;
    }

    console.log('현재 파일 정보 : ' + originalname + ', '
        + name + ', ' + mimetype + ', ' + size + ', ' + path);

    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h3>나의 메모</h3>');
    res.write('<hr>');
    res.write('<p>메모가 저장되었습니다.</p>');
    res.write('<p>작성자 : ' + paramId + '</p>')
    res.write('<p>작성일시 : ' + paramTime + '</p>')
    res.write('<p>내용 : ' + paramTextfield + '</p>')
    res.write('<p>서버에 저장된 사진</p>');
    res.write(`<p><img src=${path} style="width:100px;height:auto"/></p>`);
    res.write('<p>사진 경로</p>');
    res.write(`<p>${path}</p>`);
    res.write('<br><br><button type="button" onclick="location.href=&#39/public/photo.html&#39">다시작성</button>');
    res.end();
});

app.use('/', router);

http.createServer(app).listen(3000, () => {
    console.log('Express 서버가 3000번 포트에서 시작됨.');
})