var http = require('http');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var fs = require('fs');

var app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(expressSession({
    secret: 'secret key',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res) => {
    var output = {};
    output.cookies = req.cookies;
    output.session = req.session;

    req.session.now = (new Date()).toUTCString();
    res.send(output);
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './views/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
        console.log(Date.now());
    }
});
var upload = multer({ storage: storage });
// app.use(express.static(__dirname + '/public'));

app.get('/upload', (req, res) => {
    fs.readFile('./views/HTMLPage.html', (error, data) => {
        res.send(data.toString());
    });
});

app.post('/upload', upload.any(), (req, res) => {
    console.log(req.body);
    console.log(req.files);

    res.redirect('/upload');
});

http.createServer(app).listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});