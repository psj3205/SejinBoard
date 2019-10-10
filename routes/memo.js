const addmemo = (req, res) => {
  console.log('memo 모듈 안에 있는 addmemo 호출됨.');
  // console.log(req.body);
  const paramId = req.body.id;
  const paramTime = req.body.time;
  const paramTextfield = req.body.textfield;
  const files = req.files;
  const database = req.app.get('database');

  const fileInfo = {
    originalname: '',
    name: '',
    mimetype: '',
    size: '',
    path: ''
  };

  if (Array.isArray(files)) {
    console.log("배열에 들어있는 파일 개수 : %d", files.length);
    for (let index = 0; index < files.length; index++) {
      fileInfo.originalname = files[index].originalname;
      fileInfo.name = files[index].filename;
      fileInfo.mimetype = files[index].mimetype;
      fileInfo.size = files[index].size;
      fileInfo.path = '/' + files[index].destination + fileInfo.name;
    }
  }
  else {
    console.log('파일 개수 : 1 ');
    fileInfo.originalname = files[index].originalname;
    fileInfo.name = files[index].name;
    fileInfo.mimetype = files[index].mimetype;
    fileInfo.size = files[index].size;
    fileInfo.path = '/' + files[index].destination + fileInfo.name;
  }

  console.log(`현재 파일 정보 : ${fileInfo.originalname}, ${fileInfo.name}, ${fileInfo.mimetype}, ${fileInfo.size}, ${fileInfo.path}`);

  if (database) {
    addMemo(database, paramId, paramTime, paramTextfield, fileInfo.path, (err, result) => {
      if (err) throw err;
      if (result) {
        res.writeHead('200', { 'Content-Type': 'text/html; charset=utf-8' });
        res.write('<h3>나의 메모</h3>');
        res.write('<hr>');
        res.write('<p>메모가 저장되었습니다.</p>');
        res.write('<p>작성자 : ' + paramId + '</p>')
        res.write('<p>작성일시 : ' + paramTime + '</p>')
        res.write('<p>내용 : ' + paramTextfield + '</p>')
        res.write('<p>서버에 저장된 사진</p>');
        res.write(`<p><img src="${fileInfo.path}" style="width:100px;height:auto"/></p>`);
        res.write('<p>사진 경로</p>');
        res.write(`<p>${fileInfo.path}</p>`);
        res.write('<br><br><button type="button" onclick="location.href=&#39/public/photo.html&#39">다시작성</button>');
        res.end();
      }
      else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>메모 저장 실패</h2>');
        res.end();
      }
    });
  }
  else {
    res.writeHead('200', { 'Content-type': 'text/html;charset=utf8' });
    res.write('<h2>데이터베이스 연결 실패</h2>');
    res.end();
  }
};

const addMemo = (database, name, createdDate, text, filepath, callback) => {
  console.log('addMemo 호출됨.');
  const MemoModel = database.MemoModel;

  const memo = new MemoModel({
    "name": name,
    "memo": text,
    "createdDate": createdDate,
    "filepath": filepath
  });

  memo.save((err) => {
    if (err) {
      callback(err, null);
      return;
    }

    console.log('메모 데이터 추가함.');
    callback(null, memo);
  })
};

module.exports.addmemo = addmemo;