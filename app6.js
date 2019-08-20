var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    expressErrorHandler = require('express-error-handler');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.post('/process/login', (req, res) => {
    console.log('/process/login 처리함.');

    var paramId = req.body.id;
    var paramPassword = req.body.password;

    if (req.session.user) {
        console.log('이미 로그인되어 상품 페이지로 이동합니다.');
        res.redirect('/product.html');
    }
    else {
        req.session.user = {
            id: paramId,
            name: '소녀시대',
            authorized: true
        };
        res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
        res.write('<h1>로그인 성공.</h1>');
        res.write('<div><p>Param id: ' + paramId + '</p></div>');
        res.write('<div><p>Param password: ' + paramPassword + '</p></div>');
        res.write('<br><br><a href="/process/product">상품 페이지로 이동하기</a>');
        res.end();
    }
});

app.get('/process/users/:id', (req, res) => {
    var paramId = req.params.id;

    console.log('/process/users와 토큰 %s를 사용해 처리함.', paramId);

    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param id: ' + paramId + '</p></div>');
    res.end();
});

app.get('/process/showCookie', (req, res) => {
    console.log('/process/showCookie 호출됨');

    res.send(req.cookies);
});

app.get('/process/setUserCookie', (req, res) => {
    console.log('/process/setUserCookie 호출됨');

    res.cookie('user', {
        id: 'mike',
        name: '소녀시대',
        authorized: true
    });

    res.redirect('/process/showCookie');
});

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.get('/process/product', (req, res) => {
    console.log('/process/product 호출됨');

    if (req.session.user) {
        res.redirect('/product.html');
    }
    else {
        res.redirect('/login.html');
    }
});

app.get('/process/logout', (req, res) => {
    console.log('/process/logout 호출됨');

    if (req.session.user) {
        console.log('로그아웃합니다.');

        req.session.destroy((err) => {
            if (err) { throw err; }
            console.log('세션을 삭제하고 로그아웃했습니다.');
            res.redirect('/login.html');
        });
    }
    else {
        console.log('아직 로그인되어 있지 않습니다.');
        res.redirect('/login.html');
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3000, () => {
    console.log('Express 서버가 3000번 포트에서 시작됨.');
})