var http = require('http');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var fs = require('fs');
var DummyDB = require('./dummyDB');

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
app.get('/', (req, res) => {
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

app.get('/user', (req, res) => {
    res.send(DummyDB.get());
});
app.get('/user/:id', (req, res) => {
    res.send(DummyDB.get(req.params.id));
});

app.post('/user', (req, res) => {
    var name = req.query.name;
    var region = req.query.region;

    if (name && region) {
        res.send(DummyDB.insert({
            name: name,
            region: region
        }));
    }
    else {
        throw new Error('error');
    }
});

app.put('/user/:id', (req, res) => {
    var id = req.params.id;
    var name = req.query.name;
    var region = req.query.region;
    console.log(req.query);
    console.log(name);
    console.log(region);
    console.log(id);
    var item = DummyDB.get(id);
    console.log(item);
    console.log("params : ", req.params);
    console.log("query : ", req.query);
    item.name = name || item.name;
    item.region = region || item.region;

    res.send(item);
});

app.delete('/user/:id', (req, res) => {
    res.send(DummyDB.remove(req.params.id));
});

http.createServer(app).listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});