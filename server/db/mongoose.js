const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose, ObjectID};



