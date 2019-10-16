const moment = require('moment-timezone');
moment.locale('ko');

// 게시판 목록 보여주기 post 메소드 or get 메소드로도 호출 가능 쿼리이용해서
const listPost = (req, res) => {
  console.log('listPost 메소드 호출됨.');

  const paramPage = req.body.page || req.query.page;
  const paramPerPage = req.body.perPage || req.query.perPage;

  console.log(`요청 파라미터 : ${paramPage}, ${paramPerPage}`);

  const database = req.app.get('database');

  if (database.db) {
    const options = {
      page: paramPage,
      perPage: paramPerPage
    };

    database.PostModel.list(options, (err, results) => {
      if (err) {
        console.err(`게시판 글 목록 조회 중 오류 발생 : ${err.stack}`);

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2>게시판 글 목록 조회 중 오류 발생</h2>`);
        res.write(`<p>${err.stack}</p>`);
        res.end();
        return;
      }

      if (results) {
        console.dir(results);

        database.PostModel.count().exec((err, count) => {
          res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });

          const context = {
            title: '글 목록',
            posts: results,
            page: parseInt(paramPage),
            pageCount: Math.ceil(count / paramPerPage),
            perPage: paramPerPage,
            totalRecords: count,
            size: paramPerPage,
            moment,  // moment 모듈 전달
            user: req.user // 로그인 정보 전달
          };

          req.app.render('listpost', context, (err, html) => {
            if (err) {
              console.error(`응답 웹문서 생성 중 오류 발생 : ${err.stack}`);

              res.writeHead('200', { 'Context-Type': 'text/html;charset=utf8' });
              res.write(`<h2>응답 웹문서 생성 중 오류 발생</h2>`);
              res.write(`<p>${err.stack}</p>`);
              res.end();
              return;
            }
            res.end(html);
          });
        });
      }
    })
  }
};

module.exports.listPost = listPost;