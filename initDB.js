var fs = require('fs');
var mongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/advertisements';

var messages = JSON.parse(fs.readFileSync(__dirname + "/messages.json", 'utf8'));

mongoClient.connect(mongoUrl, function(err, db) {
    if(err){
        console.log("Problem connecting to mongodb. " + err);
        db.close();

    }else{
        console.log("Connected correctly to server.");

        db.collection('messages').remove();

        db.collection('messages').insertMany(messages, function(err, result) {
            if(err){
                console.log("Problem initializing data in mongodb. " + err);
            }else{
                console.log("Success initializing data to mongodb");
            }
            db.close();
        });
    }
});

