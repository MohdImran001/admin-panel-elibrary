const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const url = 'mongodb+srv://USERNAME:PASSWORD@cluster0-ej1ez.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority';
let _db;

const MongoConnect = (callback) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
        _db = client.db();
        callback();
    })
    .catch(err => console.log(err));
};

const getDB = () => {
    if(_db)
    {
        console.log('database connected');
        return _db;
    }
    console.log('database not connected!');
};

exports.MongoConnect = MongoConnect;
exports.getDB = getDB;

