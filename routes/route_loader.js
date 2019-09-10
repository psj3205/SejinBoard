const route_loader = {};
const config = require('../config/config');
const database = require('../database/database');
const uitil = require('../utils/utils');
const multer = require('multer');

route_loader.init = (app) => {
    console.log('route_loader.init 호출됨.');
    database.init(app, config);
    return initRoutes(app);
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
});


const initRoutes = (app) => {
    const infoLen = config.route_info.length;
    console.log(`설정에 정의됨 라우팅 모듈의 수 : ${infoLen}`);

    for (let i = 0; i < infoLen; i++) {
        const curItem = config.route_info[i];
        const curModule = require(curItem.file);

        if (curItem.type === 'get') {
            console.log('=============get=============');
            if (curItem.auth === true)
                app.get(curItem.path, uitil.isLoggedin, curModule[curItem.method]);
            else
                app.get(curItem.path, curModule[curItem.method]);
        }
        else if (curItem.type === 'post') {
            console.log('=============post=============');
            if (curItem.auth === true)
                app.post(curItem.path, uitil.isLoggedin, curModule[curItem.method]);
            else
                app.post(curItem.path, curModule[curItem.method]);
        }
        else if (curItem.type === 'post&upload') {
            console.log('=============post&upload=============');
            if (curItem.auth === true)
                app.post(curItem.path, uitil.isLoggedin, upload.array('photo', 1), curModule[curItem.method]);
            else
                app.post(curItem.path, upload.array('photo', 1), curModule[curItem.method]);
        }

        console.log(`라우팅 모듈 ${curItem.method}가 설정됨.`);
    }
};

module.exports = route_loader;