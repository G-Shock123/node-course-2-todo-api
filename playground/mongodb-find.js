//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log(`we were unable to connect, probably cause you're dumnb`);
  }
  console.log(`sucessfully connected. Lmao you a genius`);

  // db.collection('Todos').find({
  //   _id: new ObjectID('5ad7556be753cdbe45c10c51')
  //   }).toArray().then((docs)=>{
  //   console.log('todos');
  //   console.log(JSON.stringify(docs,undefined,2));
  //
  // },(err)=>{
  //   console.log('couldnt fetch todos',err);
  // });

  // db.collection('Todos').find().count().then((count)=>{
  //   console.log('todos');
  //   console.log(`ToDos Count: ${count}`);
  //
  // },(err)=>{
  //   console.log('couldnt fetch todos',err);
  // });

  db.collection('Users').find({name:'Ben'}).toArray().then((docs)=>{
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
    console.log('something went horribly wrong',err);
  });

});

  // db.close();
