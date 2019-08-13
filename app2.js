var fs = require('fs');
var http = require('http');

http.createServer((req, res) => {
    fs.readFile('./views/index.html', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}).listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});