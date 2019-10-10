const addComment = (req, res) =>{
  console.log('addComment 호출됨');

  const paramComment =req.body.comment;
  const paramCommentWriterObjId =req.body.commentWriterObjId;
  const parampostObjId =req.body.postObjId;
  console.log(`요청 파라미터 : ${paramComment}, ${paramCommentWriterObjId}, ${parampostObjId}`);
  const database = req.app.get('database');

  if(database.db){
    database.PostModel.load(parampostObjId, (err, results) => {
      if (err) {
        console.log(`댓글 추가 중 오류 발생 : ${err.stack}`);

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2>댓글 추가 중 오류 발생</h2>`);
        res.write(`<p>${err.stack}</p>`);
        res.end();
        return;
      }
      if (results == undefined || results.length < 1) {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2> [${parampostObjId}]를 찾을 수 없습니다.</h2>`);
        res.end();
        return;
      }
      console.log("댓글 검색결과");
      console.log(results);
      results.addComment(paramCommentWriterObjId, paramComment, (err, result) => {
        if (err) { throw err; }
        console.log(`댓글 데이터 추가함.`);
        return res.redirect(`/board/showpost/${results._id}`);
      });
    })
  }

};

module.exports.addComment = addComment;