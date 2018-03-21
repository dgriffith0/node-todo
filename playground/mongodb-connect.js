//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');
// console.log(new ObjectID());

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.', err);
    }
    console.log('Connect to MongoDB server');
    const db = client.db('TodoApp');


    client.close();
});

    //INSERTS

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })

    // db.collection('Users').insertOne({
    //     name: 'Dan Griff',
    //     age: 34,
    //     location: "Omaha, NE"
    // }, (err, results) => {
    //     if (err) {
    //         return console.log('Unable to insert.', err)
    //     }
    //     console.log(JSON.stringify(results.ops, undefined, 2));
    // });