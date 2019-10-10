// 새글 작성 get 메소드
const openNewPost = (req, res) => {
  const context = {
    user: req.user // 로그인 정보 전달
  };

  res.render('openpost.ejs', context, (err, html) => {
    if (err) { throw err; }
    // console.log(`응답 문서 : ${html}`);
    res.end(html);
  });
};

// 새글 작성 post 메소드
const addNewPost = (req, res) => {
  console.log('post 모듈 안에 있는 addpost 호출됨.');

  const paramTitle = req.body.title || req.query.title;
  const paramContents = req.body.contents || req.query.contents;
  const paramWriter = req.body.writer || req.query.writer;

  console.log(`요청 파라미터 : ${paramTitle}, ${paramContents}, ${paramWriter}`);

  const database = req.app.get('database');
  console.log("=====================================");
  console.log(database.db);
  console.log("=====================================");

  if (database.db) {
    database.UserModel.findByEmail(paramWriter, (err, results) => {
      if (err) {
        console.log(`게시판 글 추가 중 오류 발생 : ${err.stack}`);

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2>게시판 글 추가 중 오류 발생</h2>`);
        res.write(`<p>${err.stack}</p>`);
        res.end();
        return;
      }
      if (results == undefined || results.length < 1) {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2> [${paramWriter}]를 찾을 수 없습니다.</h2>`);
        res.end();
        return;
      }

      const userObjectId = results[0]._doc._id;
      console.log(`사용자 ObjectId : ${paramWriter} -> ${userObjectId}`);

      const post = new database.PostModel({
        title: paramTitle,
        contents: paramContents,
        writer: userObjectId,
      });

      post.savePost((err, result) => {
        if (err) { throw err; }

        console.log(`글 데이터 추가함.`);
        console.log(`글 작성, 포스팅 글을 생성했습니다. : ${post._id}`);
        return res.redirect(`/board/showpost/${post._id}`);
      });
    });
  }
};

module.exports.openNewPost = openNewPost;
module.exports.addNewPost = addNewPost;