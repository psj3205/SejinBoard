const utils = require('../utils/utils');

const Schema = {};

Schema.createSchema = (mongoose) => {
  const PostSchema = mongoose.Schema({
    title: { type: String, trim: true, 'default': '' },
    contents: { type: String, trim: true, 'default': '' },
    writer: { type: mongoose.Schema.ObjectId, ref: 'users6' },
    tags: { type: [], 'default': '' },
    views: { type: Number, 'default': 0 },
    created_at: { type: Date, index: { unique: false }, 'default': Date.now },
    updated_at: { type: Date, index: { unique: false }, 'default': Date.now },
    comments: [{
      contents: { type: String, trim: true, 'default': '' },
      writer: { type: mongoose.Schema.ObjectId, ref: 'users6' },
      created_at: { type: Date, 'default': Date.now },
    }]
  });

  PostSchema.path('title').required(true, '글 제목을 입력하셔야 합니다.');
  PostSchema.path('contents').required(true, '글 내용을 입력하셔야 합니다.');

  PostSchema.methods = {
    savePost: function (callback) {
      const self = this;

      this.validate(function (err) {
        if (err) return callback(err);
        self.save(callback);
      });
    },

    addComment: function (user, comment, callback) {
      this.comments.push({
        contents: comment,
        writer: user
      });
      this.save(callback);
    },

    removeComment: function (id, callback) {
      const index = utils.indexOf(this.comments, { _id: id });
      console.log(index);
      if (index > -1) {
        this.comments.splice(index, 1);
      }
      else {
        return callback(`ID [${id}]를 가진 댓글 객체를 찾을 수 없습니다.`);
      }
      this.save(callback);
    }, 
    updateComment: function(id, updatedComment, callback){
      const index = utils.indexOf(this.comments, { _id: id });
      if(index > -1){
        this.comments[index].contents = updatedComment;
      }
      else {
        return callback(`ID [${id}]를 가진 댓글 객체를 찾을 수 없습니다.`);
      }
      this.save(callback);
    }
  };

  PostSchema.statics = {
    load: function (id, callback) {
      this.findOne({ _id: id })
        .populate('writer', 'name provider email')
        .populate('comments.writer', 'name provider email')
        .exec(callback);
    },
    list: function (options, callback) {
      const criteria = options.criteria || {};

      this.find(criteria)
        .populate('writer', 'name provider email')
        .sort({ 'created_at': -1 })
        .limit(Number(options.perPage))
        .skip(options.perPage * options.page)
        .exec(callback);
    },
    deletePost: function (id, callback) {
      this.remove({ _id: id }, callback);
    },
    updatePost: function (id, update, callback) {
      this.findByIdAndUpdate({ _id: id }, update, callback);
    }
  };
  console.log('PostSchema 정의함.');

  return PostSchema;
};

module.exports = Schema;
