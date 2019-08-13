var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer((req, res) => {
    if (req.method == 'GET') {
        fs.readFile('./views/OtherPage.html', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.method == 'POST') {
        req.on('data', (data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>' + data + '</h1>');
        });
    }
}).listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});