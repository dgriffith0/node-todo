require('./config/config');
var {ObjectID} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');


var app = express();
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
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


app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        } else {
            res.send({todo});
        }
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
  
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'body']);
    user.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    })
    res.send(body);
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.get('/', (req, res) => {
   res.status(200).send(`Started on Port ${process.env.PORT}`); 
});

app.listen(process.env.PORT, () => console.log(`Started on Port ${process.env.PORT}`));

module.exports = {
    app
}
