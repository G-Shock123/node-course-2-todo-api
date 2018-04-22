const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'Konnie@gmail.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:userOneId, access: 'auth'}, 'abc123').toString()
  }]


},{
  _id: userTwoId,
  email: 'Jess@gmail.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:userTwoId, access: 'auth'}, 'abc123').toString()
  }]

}];

const todos = [{
  _id: new ObjectID(),
  text: 'test 1',
  _creator: userOneId

}, {
  _id: new ObjectID(),
  text: 'test 2',
  completed: true,
  completedAt:123,
  _creator: userTwoId
}];


//var id2 = new ObjectID();

const populateTodos = (done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);

  }).then(()=>done());
};

const populateUsers = (done) =>{

  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])

    }).then(()=>done());

};
module.exports = {todos, populateTodos, users, populateUsers};
