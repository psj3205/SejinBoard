const Entities = require('html-entities').AllHtmlEntities;

const addpost = (req, res) => {
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
                writer: userObjectId
            });

            post.savePost((err, result) => {
                if (err) { throw err; }

                console.log(`글 데이터 추가함.`);
                console.log(`글 작성, 포스팅 글을 생성했습니다. : ${post._id}`);
                return res.redirect(`/process/showpost/${post._id}`);
            });
        });
    }
};

const showpost = (req, res) => {
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
                // console.dir(results);
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                results.views++;
                results.save();

                const context = {
                    title: '글 조회',
                    posts: results,
                    Entities: Entities
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

const listpost = (req, res) => {
    console.log('post 모듈 안에 있는 listpost 호출됨.');

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
                        size: paramPerPage
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

module.exports.addpost = addpost;
module.exports.showpost = showpost;
module.exports.listpost = listpost;