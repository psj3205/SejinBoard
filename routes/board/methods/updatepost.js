const Entities = require('html-entities').AllHtmlEntities;
const moment = require('moment-timezone');
moment.locale('ko');

const updatePost = (req, res) =>{
  console.log('updatePost 메소드 호출됨.');
  const paramId = req.body.postId || req.query.postId || req.params.postId;
  const updatedtitle = req.body.title || req.query.title || req.params.title;
  const updatedContents = req.body.contents || req.query.contents || req.params.contents;
  const update = {
    title: updatedtitle,
    contents : updatedContents,
  };
  console.log(`요청 파라미터 : ${paramId}`);

  const database = req.app.get('database');

  if(database.db){
    database.PostModel.updatePost(paramId, update, (err, results)=>{
      if (err) {
        console.log(`게시판 글 수정 중 오류 발생 : ${err.stack}`);

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2>게시판 글 수정 중 오류 발생</h2>`);
        res.write(`<p>${err.stack}</p>`);
        res.end();
        return;
      }
      
      console.log('글 수정 성공');
      return res.redirect(`/board/showpost/${paramId}`);
    })
  }
};

const openUpdatePost = (req, res) => {
  console.log('post 모듈 안에 있는 updateopen 호출됨.');

  const paramId = req.body.id || req.query.id || req.params.id;

  console.log(`요청 파라미터 : ${paramId}`);

  const database = req.app.get('database');

  if (database.db) {
    database.PostModel.load(paramId, (err, results) => {
      if (err) {
        console.log(`게시판 글 조회 중 오류 발생 : ${err.stack}`);

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2>게시판 글 조회 중 오류 발생</h2>`);
        res.write(`<p>${err.stack}</p>`);
        res.end();
        return;
      }

      if (results) {
        console.dir(results);
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        results.views++;
        results.save();

        const context = {
          title: '글 조회',
          posts: results,
          Entities: Entities,
          moment, // moment 모듈 전달
          user: req.user // 로그인 정보 전달
        };

        req.app.render('updatepost', context, (err, html) => {
          if (err) { throw err; }
          // console.log(`응답 문서 : ${html}`);
          res.end(html);
        });
      }
    })
  }
};

module.exports.updatePost = updatePost;
module.exports.openUpdatePost = openUpdatePost;