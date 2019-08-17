var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

var server = http.createServer((req, res) => {
    fs.readFile('./views/HTMLPage2.html', 'utf8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}).listen(52273, () => {
    console.log('Server running at http://127.0.0.1:52273');
});

var io = socketio.listen(server);
io.sockets.on('connection', (socket) => {
    socket.on('message', (data) => {
        io.sockets.emit('message', data);
    });
});