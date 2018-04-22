const expect =require ('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos,users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos',()=>{
  it('should crete a new todo',(done)=>{
    var text = 'Test to do test';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));
    });
  });



  it('should not create a todo with invalid body data ',(done)=>{

    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=>{
      if (err){
        return done(err);
      }

    Todo.find().then((todos)=>{
      expect(todos.length).toBe(2);
      done();
    }).catch((e)=>done(e));
  });
  });
});

describe('Get /todos,',()=>{
  it('should get all todos', (done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);

    })
    .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('Should return a todo Doc', (done)=>{

    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it('should return 404 if todo not found',(done)=>{
    var id2 = new ObjectID();
    request(app)
    .get(`/todos/${id2.toHexString()}`)
    .expect(404)
    .end(done);
});

  it('should return 404 an invalid todo id',(done)=>{
    request(app)
    .get(`/todos/1233`)
    .expect(404)
    .end(done);

  });
});

describe('DELETE /todos/:id',()=>{
  it('Should delete a doc and return what was delted',(done)=>{
    var hexId = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(hexId);

    })
    .end((err,res)=>{
      if (err){
        return done(err);
      }

      Todo.findById(hexId).then((todo)=>{
        expect(todo).toNotExist();
        done();
      }).catch((e)=>done(e));
    });
  })



  it('should return a 404 if to do not found',(done)=>{
    var hexId = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);

  });

  it('should returna  404 if object id is invalid',(done)=>{

    request(app)
    .delete(`/todos/1233`)
    .expect(404)
    .end(done);


  });
});

describe('PATCH /todos/:id',()=>{
  it ('should update the todo', (done)=>{
    var hexId = todos[0]._id.toHexString();
    var text = "Lord my lord";

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })

      .end(done)

      });
it('should clear CompletedAt when todo not is not completed',(done)=>{
  var hexId = todos[1]._id.toHexString();
  var text = 'new text'

  request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed:false,
      text,
      completedAt:123
    })
    .expect(200)
    .expect((res) =>{
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done)

})

});

describe('GET / users/me',()=>{

  it('should return user if authenticated', (done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);

  });

  it('should return 401 if not authenticated',(done)=>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done);

  });
});

describe('POST /users/me',()=>{
  it('should create a user',(done)=>{
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) =>{
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e)=>done(e));
      });

  });



  it('should return validation error if request invalid',(done)=>{
    var email = 'example@gm@ail.com';
    var password = '123';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect((res)=>{
        expect(res.headers['x-auth']).toNotExist()
      })
      .end(done)


  });

  it('should not create user if email in use already',(done)=>{

    var email= 'Jess@gmail.com';
    var password ='userTwopass';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done)

  });


});

describe('POST /users/login',()=>{

  it('should login user and return auth token',(done)=>{
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.token[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e)=>done(e));
      });

  });

  it('should reject invalid login',(done)=>{

    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password :users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.token.length).toBe(0);

          done();
        }).catch((e)=>done(e));
      });


    });

});




//
//
//   it('should clear completedAt when todo is note compelted',(done)=>{
//   var hexId = todos[1]._id.toHexString();
//
//   request(app)
//   .patch(`/todos/${hexId}`)
//   .expect(200)
//   .expect((res)=>{
//     expect(res.body.todo._id).toBe(hexId);
//
//   })
//   .end((err,res)=>{
//     if (err){
//       return done(err);
//     }
//
//   Todo.findByIdAndUpdate(hexId,{
//     $set:{
//       text:'update',
//       completed:false,
//       completedAt: null
//     }},
//     {new:true}).then((todo)=>{
//
//
//       expect(todo.completedAt).toNotExist();
//       expect(200);
//       done();
//     }).catch((e)=>done(e));
//   });
// });
// });
//
//
//
//
//
//   //
//   // it ('should clear completed AT when todo is note completed', ()=>{
//   //   var hexId = todos[1]._is.HexString();
//   //
//   //   Todo.findByIdAndUpdate(id,{$set: })
//   //
//   //  });
