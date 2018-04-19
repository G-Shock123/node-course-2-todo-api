//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log(`we were unable to connect, probably cause you're dumnb`);
  }
  console.log(`sucessfully connected. Lmao you a genius`);

//   db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID('5ad82a178fce2221a3835ba4')
//   },{
//     $set:{
//       completed: false
//     }
//   },{
//     returnOriginal: false
//   }).then((result)=>{
//     console.log(result);
//   });
// });

  db.collection('Users').findOneAndUpdate({

    _id: new ObjectID('5ad756c2502a48be8d79355e')
  },{
    $set:{
      name: 'Kon'
    },
      $inc:{
      age: 1
    }

  },{returnOriginal: false
}).then((result)=>{
  console.log(result);
});


});
