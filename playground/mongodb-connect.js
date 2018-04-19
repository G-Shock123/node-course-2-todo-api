//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log(`we were unable to connect, probably cause you're dumnb`);
  }
  console.log(`sucessfully connected. Lmao you a genius`);

  // db.collection('Todos').insertOne({
  //   text: 'something to do',
  //   completed: false
  //
  //
  // },(err, result)=>{
  //   if(err){
  //     return console.log('Unable to insert toDo',err);
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'kon',
  //   age: 23,
  //   location: 'Jamdown'
  // }, (err,results)=>{
  //   if(err){
  //     return console.log('Unable to create the user',err);
  //   }
  //   console.log(results.ops[0]._id.getTimestamp());
  // });

  db.close();
});
