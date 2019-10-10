const Entities = require('html-entities').AllHtmlEntities;
const moment = require('moment-timezone');
moment.locale('ko');

// 선택한 글 보여주기
const showPost = (req, res) => {
  console.log('post 모듈 안에 있는 showpost 호출됨.');

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
        console.dir("글 읽기 결과!!!");
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

        req.app.render('showpost', context, (err, html) => {
          if (err) { throw err; }
          // console.log(`응답 문서 : ${html}`);
          res.end(html);
        });
      }
    })
  }
};

module.exports.showPost = showPost;