const login = (req, res) => {
    console.log('user 모듈 안에 있는 login 호출됨.');

    const paramId = req.body.id;
    const paramPassword = req.body.password;
    const database = req.app.get('database');

    if (database) {
        authUser(database, paramId, paramPassword, (err, docs) => {
            if (err) throw err;
            if (docs) {
                console.dir(docs);

                const username = docs[0].name;

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });

                const context = {
                    userid: paramId,
                    username: username
                };
                req.app.render('login_success', context, (err, html) => {
                    if (err) {
                        console.error(`뷰 렌더링 중 오류 발생 : ${err.stack}`);

                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write(`<h2>뷰 렌더링 중 오류 발생</h2>`);
                        res.write(`<p>${err.stack}</p>`);
                        res.end();
                        return;
                    }
                    console.log(`rendered : ${html}`);
                    res.end(html);
                });
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오.</p></div>');
                res.write(`<br><br><a href='/public/login.html'>다시 로그인 하기</a>`);
                res.end();
            }
        });
    }
    else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
};

const adduser = (req, res) => {
    console.log('user 모듈 안에 있는 adduser 호출됨.');

    const paramId = req.body.id;
    const paramPassword = req.body.password;
    const parmaName = req.body.name;
    const database = req.app.get('database');

    if (database) {
        addUser(database, paramId, paramPassword, parmaName, req, (err, result) => {
            if (err) throw err;
            if (result) {
                console.dir(result);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });

                const context = { title: '사용자 추가 성공' };
                req.app.render('adduser', context, (err, html) => {
                    if (err) {
                        console.error(`뷰 렌더링 중 오류 발생 : err.stack`);

                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                        res.write(`<p>${err.stack}</p>`);
                        res.end();

                        return;
                    }
                    console.log(`rendered : ${html}`);
                    res.end(html);
                });
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 실패</h2>');
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

const listuser = (req, res) => {
    console.log('user 모듈 안에 있는 listuser 호출됨.');
    const database = req.app.get('database');
    const UserModel = database.UserModel;

    if (database) {
        UserModel.findAll((err, results) => {
            if (err) {
                console.log(`사용자 리스트 조회 중 오류 발생 : ${err.stack}`);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write(`<p>err.stack</p>`);
                res.end();

                return;
            }
            if (results) {
                // console.dir(results);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });

                const context = { results: results };
                req.app.render('listuser', context, (err, html) => {
                    if (err) { throw err; }
                    console.log(`rendered : ${html}`);
                    res.end(html);
                });
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트 조회 실패</h2>');
                res.end();
            }
        });
    }
    else {
        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
};

const authUser = (database, id, password, callback) => {
    console.log('authUser 호출됨');
    const UserModel = database.UserModel;

    // mongoose 모듈을 사용하여 사용자를 인증할 경우//////////////////////////////////////
    UserModel.findById(id, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);

        if (results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음.');

            const user = new UserModel({ id: id });
            const authenticated = user.authenticate(password, results[0]._doc.salt,
                results[0]._doc.hashed_password);

            if (authenticated) {
                console.log('비밀번호 일치함');
                callback(null, results);
            }
            else {
                console.log('비밀번호 일치하지 않음.');
                callback(null, null);
            }
        }
        else {
            console.log('아이디와 일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    });
};

const addUser = (database, id, password, name, req, callback) => {
    console.log('addUser 호출됨.');
    const UserModel = database.UserModel;

    // mongoose 모듈을 사용하여 사용자를 추가할 경우//////////////////////////////////////
    const user = new UserModel({
        "id": id,
        "password": password,
        "name": name
    });

    user.save((err) => {
        if (err) {
            callback(err, null);
            return;
        }
        console.log('사용자 데이터 추가함.');
        callback(null, user);
    });
};

module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser; 