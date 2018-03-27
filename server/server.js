require('./config/config');
var {mongoose, ObjectID} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

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
        res.status(200).send({
            todos
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('Invalid Id.');
    }
    Todo.find({_id: ObjectID(id)})
    .then((todo) => {
        if (todo.length === 0) {
           res.status(404).send('Id not found.');
        } else {   
            res.status(200).send({todo});
        }
    }).catch((err) => {
        res.status(400).send(err)
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id)
    .then((todo) => {
        if (!todo) {
            return res.status(404).send(JSON.stringify({response: {error: `No matching record for ${id}`}}))
        }
        res.status(200).send(JSON.stringify({deleted: {todo}}));
    }).catch((err) => res.status(400).send(err));
});

app.get('/', (req, res) => {
   res.status(200).send(`Started on Port ${process.env.PORT}`); 
});

app.listen(process.env.PORT, () => console.log(`Started on Port ${process.env.PORT}`));

module.exports = {
    app
}
