const updateComment = (req, res) => {
  console.log('updateComment 메소드 호출됨.');
  const paramCommentObjId = req.body.commentObjId;
  const paramPostObjId = req.body.postObjId;
  const paramUpdatedComment = req.body.updatedComment;
  console.log(`요청 파라미터: ${paramCommentObjId}, ${paramPostObjId}, ${paramUpdatedComment}`);

  const database = req.app.get('database');

  if (database.db) {
    database.PostModel.load(paramPostObjId, (err, results) => {
      if (err) {
        console.log(`댓글 수정 중 오류 발생 : ${err.stack}}`);
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2>댓글 수정 중 오류 발생</h2>`);
        res.end();
        return;
      }
      if (results == undefined || results.length < 1) {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2> [${paramPostObjId}]를 찾을 수 없습니다.</h2>`);
        res.end();
        return;
      }
      console.log("댓글 검색결과");
      console.log(results);
      results.updateComment(paramCommentObjId, paramUpdatedComment, (err, result) => {
        if (err) { throw err; }
        console.log(`댓글 데이터 수정함.`);
        return res.redirect(`/board/showpost/${results._id}`);
      });
    });
  }

};

module.exports.updateComment = updateComment;