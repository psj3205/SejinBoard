var fs = require('fs');
var http = require('http');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    if (req.cookies.auth) {
        res.send('<h1>Login Success</h1>');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    fs.readFile('./views/login.html', (error, data) => {
        res.send(data.toString());
    });
});

app.post('/login', (req, res) => {
    var login = req.body.login;
    var password = req.body.password;

    console.log(login, password);
    console.log(req.body);

    if (login == 'rint' && password == '1234') {
        res.cookie('auth', true);
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

http.createServer(app).listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});