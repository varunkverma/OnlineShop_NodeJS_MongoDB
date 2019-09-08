const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://varunkverma:7860@onlineshopdb-8oebu.mongodb.net/test?retryWrites=true&w=majority";

let _db;
//const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// Used to make a connecton with mongodb
const mongoConnect = (callback) => {
    const client =new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology:true,autoReconnect:true});
    client.connect()
    .then( mongoClient => {
        console.log('Connected!!!');
        _db = mongoClient.db('shop');
        callback();
    })
    .catch(err => {
        console.log("Error while Connecting !!!!!!!", err );
    });
    
        //err => {
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log('Connected!!!');
    //     _db = client.db('shop');
    //     callback(client);         
    // })  
}

// Used to provide access to the database mentioned in the uri while creating a client
const getDB = () => {
    if(_db){
        return _db;
    }
    throw 'No Database Found'
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;