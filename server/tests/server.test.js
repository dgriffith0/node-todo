const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const {todos, populateTodos}= require('./seed/seed');

beforeEach(populateTodos);

describe('POST /todos', ()=> {
    it('should create a new todo', (done) =>{
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({ text })
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err) => done(err));
        });
    });

    it('should not create todo with invalid body data', (done) => {
        var text = '';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});


describe('GET /todos/:id', () => {
    it('should get a requested todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo[0].text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('it should return 400 for invalid object ids', (done) => {
        request(app)
        .get('/todos/123')
        .expect(400)
        .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get('/todos/5aba68d5cd70a40fd057c91z')
            .expect(404)
            .expect((res) => {
                console.log(res.body);
            })
            .end(done);
    });

    //it should return 404 for non object ids (async)
})