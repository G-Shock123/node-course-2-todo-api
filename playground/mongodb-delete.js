//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log(`we were unable to connect, probably cause you're dumnb`);
  }
  console.log(`sucessfully connected. Lmao you a genius`);

  //deletemany
//   db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result)=>{
//     console.log(result);
//   });
// });


//delete insertOne
  //   db.collection('Todos').deleteOne({text:'eat lunch'}).then((result)=>{
  //     console.log(result);
  //   });
  // });

    //
    // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
    //     console.log(result);
    //   });
    // });
  // db.close();


  db.collection('Users').deleteMany({name: 'kon'}).then((result)=>{
    console.log(result);
  });

  db.collection('Users').findOneAndDelete({_id: new ObjectID('5ad75e25356ff3bf185fd9b1')}).then((result)=>{
    console.log(result);
  });
});
