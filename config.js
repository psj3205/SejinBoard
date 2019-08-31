module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/shopping',
    db_schemas: [{
        file: '../database/user_schema',
        collection: 'users',
        schemaName: 'UserSchema',
        modelName: 'UserModel'
    }],
    route_info: [{
        file: './user',
        path: '/process/login',
        method: 'login',
        type: 'post'
    }, {
        file: './user',
        path: '/process/adduser',
        method: 'adduser',
        type: 'post'
    }, {
        file: './user',
        path: '/process/listuser',
        method: 'listuser',
        type: 'post'
    }]
};