const mongoose = require('mongoose');

const database = {};

database.init = (app, config) => {
    console.log('init() 호출됨.');
    connect(app, config);
};

const connect = (app, config) => {
    console.log('connect() 호출됨.');

    mongoose.connect(config.db_url);
    database.db = mongoose.connection;

    database.db.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.db.on('open', () => {
        console.log('데이터베이스에 연결되었습니다. : ' + config.db_url);
        createSchema(app, config);
    });
    database.db.on('disconnected', () => {
        console.log('연결이 끊어졌습니다. 5초 후에 다시 연결합니다.');
        setInterval(connect, 5000);
    });
};

const createSchema = (app, config) => {
    const schemaLen = config.db_schemas.length;
    console.log(`설정에 정의된 스키마의 수 : ${schemaLen}`);

    for (let i = 0; i < schemaLen; i++) {
        const curItem = config.db_schemas[i];

        const curSchema = require(curItem.file).createSchema(mongoose);
        console.log(`${curItem.file} 모듈을 불러들인 후 스키마 정의함.`);

        const curModel = mongoose.model(curItem.collection, curSchema);
        console.log(`${curItem.collection} 컬렉션을 위해 모델 정의함`);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log(`스키마 이름 ${curItem.schemaName}, 모델 이름 ${curItem.modelName}이 database 객체의 속성으로 추가됨.`);
    }

    app.set('database', database);
    console.log('database 객체가 app 객체의 속성으로 추가됨.');
};

module.exports = database;