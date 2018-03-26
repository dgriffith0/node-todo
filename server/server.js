var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var ObjectId = require('mongodb').ObjectID;


var bodyParser = require('body-parser');
var express = require('express');

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    }).save().then((doc) => {
        res.status(200).send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        }).catch((err) => {
            res.status(400).send(err);
        });
    });
});

app.get('/todos/:id', (req, res) => {
    Todo.find({_id: ObjectId(req.params.id)})
    .then((todo) => {
        if (todo.length === 0) {
            return res.status(404).send('Id not found.');
        } else {   
            console.log(todo.length);
            res.status(200).send({todo});
        }
    }).catch((err) => {
        res.status(400).send(err)
    });
});


app.listen(3000, () => console.log('Started on Port 3000'));

module.exports = {
    app
}