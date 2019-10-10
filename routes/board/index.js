const createPost = require('./methods/createpost');
const deletePost = require('./methods/deletepost');
const readPost = require('./methods/readpost');
const updatePost = require('./methods/updatepost');
const listPost = require('./methods/listpost');

module.exports.addNewPost = createPost.addNewPost;
module.exports.openNewPost = createPost.openNewPost;
module.exports.deletePost = deletePost.deletePost;
module.exports.showPost = readPost.showPost;
module.exports.updatePost = updatePost.updatePost;
module.exports.openUpdatePost = updatePost.openUpdatePost;
module.exports.listPost = listPost.listPost;