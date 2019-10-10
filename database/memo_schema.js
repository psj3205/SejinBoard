const Schema = {};

Schema.createSchema = (mongoose) => {
  const MemoSchema = new mongoose.Schema({
    name: { type: String, index: 'hashed', 'default': ' ' },
    memo: { type: String, 'default': ' ' },
    createdDate: { type: String, 'default': ' ' },
    filepath: { type: String, 'default': ' ' }
  });

  console.log('MemoSchema 정의함.');
  return MemoSchema;
};

module.exports = Schema;