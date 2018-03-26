const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose, ObjectId};



