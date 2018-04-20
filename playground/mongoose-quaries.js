const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5ad85de0d91342e119fb4cc2'

if (!ObjectID.isValid(id)){
  console.log('This id not even valid');
}

User.findById(id).then((user)=>
{
  if (!user){
    return console.log('User is not in existence');
  }
  console.log('The user name is',user.email);
})

  .catch((e)=> console.log(e));

// var id = '5ad97cf36ec64016782d870912345';
//
// if(!ObjectID.isValid(id)){
//   console.log('naaaah this id not even valid');
// }
//
// // Todo.find({
// //   _id: id
// // }).then((todos)=>{
// //   console.log(`Todos${todos}`);
// // });
// //
// // Todo.findOne({
// //   _id: id
// // }).then((todo)=>{
// //   console.log(`First completed todos is${todo}`);
// // });
//
// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log('ID not found');
//   }
//   console.log(`LOOK HETE${todo}`);
// }).catch((e)=>console.log(e));
