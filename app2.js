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
var mysql = require('mysql');
var ejs = require('ejs');

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

var client = mysql.createConnection({
    user: 'root',
    password: '3gkd0wkr9wjs05!',
    database: 'Company'
}, function (error) {
    if (error) {
        console.log(error);
    }
});
client.query('SELECT * FROM products', function (error, result, fields) {
    if (error) {
        console.log(error);
    }
    else {
        console.log(result);
    }
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

app.get('/', (req, res) => {
    fs.readFile('./views/list.html', 'utf8', (err, data) => {
        client.query('SELECT * FROM products', (err, results) => {
            res.send(ejs.render(data, {
                data: results
            }));
        });
    });
});

app.get('/delete/:id', (req, res) => {
    client.query('DELETE FROM products WHERE id=?', [req.params.id], () => {
        res.redirect('/');
    })
});

app.get('/insert', (req, res) => {
    fs.readFile('./views/insert.html', 'utf8', (err, data) => {
        res.send(data);
    });
});

app.post('/insert', (req, res) => {
    var body = req.body;
    console.log(body);
    client.query('INSERT INTO products (name, modelnumber, series) VALUES (?,?,?)', [
        body.name, body.modelnumber, body.series
    ], () => {
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    fs.readFile('./views/edit.html', 'utf8', (err, data) => {
        client.query('SELECT * FROM products WHERE id =?', [
            req.params.id
        ], (err, result) => {
            res.send(ejs.render(data, {
                data: result[0]
            }));
        });
    });
});

app.post('/edit/:id', (req, res) => {
    var body = req.body;

    client.query('UPDATE products SET name=?, modelnumber=?, series=? WHERE id=?', [
        body.name, body.modelnumber, body.series, req.params.id
    ], () => {
        res.redirect('/');
    });
});

http.createServer(app).listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});