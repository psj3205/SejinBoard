const database = {};
const UserModel = {};

const init = (db, model) => {
    console.log('init 호출됨.');

    database.db = db;
    UserModel.model = model;
};

const login = (req, res) => {
    console.log('user 모듈 안에 있는 login 호출됨.');

    const paramId = req.body.id;
    const paramPassword = req.body.password;

    if (database.db) {
        authUser(database.db, paramId, paramPassword, (err, docs) => {
            if (err) throw err;
            if (docs) {
                console.dir(docs);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>로그인 성공!</h1>');
                res.write(`<div><p>사용자 아이디 : ${paramId}</p></div>`);
                res.write(`<div><p>사용자 이름 : ${docs[0].name}</p></div>`);
                res.write(`<br><br><a href='/public/login.html'>다시 로그인 하기</a>`);
                res.end();
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

    if (database.db) {
        addUser(database.db, paramId, paramPassword, parmaName, (err, result) => {
            if (err) throw err;
            if (result) {
                console.dir(result);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
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

    if (database.db) {
        UserModel.model.findAll((err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            if (results) {
                // console.dir(results);

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트</h2>');
                res.write('<div><ul>');
                for (let i = 0; i < results.length; i++) {
                    let curId = results[i]._doc.id;
                    let curName = results[i]._doc.name;
                    res.write(`<li># ${i} :  ${curId}, ${curName} </li>`);
                }

                res.write('</ul></div>');
                res.end();
            }
            else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h2>사용자 리스트 조회 실패</h2>');
                res.end();
            }
        });
    }
};

const authUser = (database, id, password, callback) => {
    console.log('authUser 호출됨');

    // mongoose 모듈을 사용하여 사용자를 인증할 경우//////////////////////////////////////
    UserModel.model.findById(id, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);

        if (results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음.');

            const user = new UserModel.model({ id: id });
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

const addUser = (database, id, password, name, callback) => {
    console.log('addUser 호출됨.');

    // mongoose 모듈을 사용하여 사용자를 추가할 경우//////////////////////////////////////
    const user = new UserModel.model({ "id": id, "password": password, "name": name });

    user.save((err) => {
        if (err) {
            callback(err, null);
            return;
        }
        console.log('사용자 데이터 추가함.');
        callback(null, user);
    });
};

module.exports.init = init;
module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;