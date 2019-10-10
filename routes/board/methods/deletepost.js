// 글 삭제 post 메소드
const deletePost = (req, res) =>{
  console.log('post 모듈 안에 있는 deletepost 호출됨.');

  const paramId = req.body.postId || req.query.postId || req.params.postId;

  console.log(`요청 파라미터 : ${paramId}`);
  
  const database = req.app.get('database');

  if(database.db) {
    database.PostModel.deletePost(paramId, (err, results) => {
      if (err) {
        console.log(`게시판 글 삭제 중 오류 발생 : ${err.stack}`);

        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write(`<h2>게시판 글 삭제 중 오류 발생</h2>`);
        res.write(`<p>${err.stack}</p>`);
        res.end();
        return;
      }

      console.log('글 삭제 성공');
      return res.redirect(`/board/listpost?page=0&perPage=5`);
    })
  }
};

module.exports.deletePost = deletePost;