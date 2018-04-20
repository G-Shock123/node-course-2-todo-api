const expect =require ('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos = [{
  _id: new ObjectID(),
  text: 'test 1'
}, {
  _id: new ObjectID(),
  text: 'test 2'
}];

var id2 = new ObjectID();


beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);

  }).then(()=>done());
});


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
