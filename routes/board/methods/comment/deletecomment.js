const deleteComment = (req, res) => {
  console.log('deleteComment 메소드 호출됨.');

  const paramPostObjId = req.body.postId || req.query.postId || req.params.postId;
  const paramCommentObjId = req.body.commentObjId;

  console.log(`요청 파라미터 : ${paramPostObjId}, ${paramCommentObjId}`);

  const database = req.app.get('database');

  if(database.db) {
    database.PostModel.load(paramPostObjId, (err, results) =>{
      if (err) {
        console.log(`댓글 삭제 중 오류 발생 : ${err.stack}`);

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2>댓글 삭제 중 오류 발생</h2>`);
        res.write(`<p>${err.stack}</p>`);
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
      results.removeComment(paramCommentObjId, (err, result) => {
        if (err) { throw err; }
        console.log(`댓글 데이터 삭제.`);
        return res.redirect(`/board/showpost/${results._id}`);
      });
    })
  }

};

module.exports.deleteComment = deleteComment;