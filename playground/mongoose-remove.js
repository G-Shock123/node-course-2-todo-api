const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

Todo.findByIdAndRemove('5ad9bb288fce2221a3838284').then((doc)=>{
  console.log(doc);
});
