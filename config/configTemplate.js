module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/shopping',
    db_schemas: [{
        file: '../database/user_schema',
        collection: 'users6',
        schemaName: 'UserSchema',
        modelName: 'UserModel'
    }, {
        file: '../database/memo_schema',
        collection: 'memo',
        schemaName: 'MemoSchema',
        modelName: 'MemoModel'
    }],
    route_info: [
    ],
    facebook: {
        clientID: '',
        clientSecret: '',
        callbackURL: ''
    },
    kakao: {
        clientID: '',
        callbackURL: ''
    },
    google: {
        clientID: '',
        clientSecret: '',
        callbackURL: ''
    },
    naver: {
        clientID: '',
        clientSecret: '',
        callbackURL: ''
    }
    // route_info: [{
    //     file: './user',
    //     path: '/process/login',
    //     method: 'login',
    //     type: 'post'
    // }, {
    //     file: './user',
    //     path: '/process/adduser',
    //     method: 'adduser',
    //     type: 'post'
    // }, {
    //     file: './user',
    //     path: '/process/listuser',
    //     method: 'listuser',
    //     type: 'post'
    // }, {
    //     file: './memo',
    //     path: '/process/photo',
    //     method: 'addmemo',
    //     type: 'post&upload'
    // }]
};