var http = require('http');
var fs = require('fs');

var server = http.createServer();

var port = 3000;
server.listen(port, () => {
    console.log('웹 서버가 시작되었습니다. : %d', port);
});

server.on('connection', (socket) => {
    var addr = socket.address();
    console.log('클라이언트가 접속했습니다.: %s, %d', addr.address, addr.port);
});

server.on('request', (req, res) => {
    console.log('클라이언트 요청이 들어왔습니다.');

    var filename = './views/다운로드.jpg';
    var infile = fs.createReadStream(filename, { flags: 'r' });

    infile.pipe(res);
    // fs.readFile(filename, (err, data) => {
    //     res.writeHead(200, { 'Content-Type': 'image/jpg' });
    //     res.write(data);
    //     res.end();
    // });
});

server.on('close', () => {
    console.log('서버가 종료됩니다.');
});