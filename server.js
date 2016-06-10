var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/advertisements';
var mongoDB;
var users = [];
var messagesCollection;
mongoClient.connect(mongoUrl, function(err, db) {
    if(err){
        console.log("Problem with connecting to mongodb. " + err);
    }else{
        mongoDB = db;
        messagesCollection= db.collection('messages');
        console.log("Connected correctly to server.");
    }
});

app.use(express.static(__dirname));
app.use(express.bodyParser());

app.get("/screen=:screen", function(request, response) {
    response.sendfile(__dirname + "/main.html")
});

app.get("/manager", function(request, response){
    response.sendfile(__dirname + "/app/manager.html")
});

app.get("/messages/screen=:screen", function(request, response){
    messagesCollection.find({screen:parseInt(request.params.screen)}).toArray(function(err, messages) {
        response.json(messages);
        response.end();
    });
});

app.get("/messages", function(request, response) {
    messagesCollection.find().toArray(function (err, messages) {
        response.json(messages);
        response.end();
    });
});

app.post("/messages", function(request, response){
    var newMessage = request.body;
    messagesCollection.find({}, {id: 1, _id: 0}).sort({id: -1}).limit(1).toArray(function (err, maxId) {
        newMessage['id'] = maxId[0].id + 1;

        messagesCollection.insertOne(newMessage, function(err, result) {
            if(err){
                console.log("Problem add new message to mongodb: " + err);
            }else{
                console.log("Success add new message to mongodb");
            }

            for(var i = 0; i< users.length; i++){
                if(users[i].screenId == parseInt(newMessage['screen'])){
                    users[i].emit('newMessage',newMessage);
                }
            }

            response.end();
        });
    });
});

app.put("/messages", function(request, response) {
    var updatedMessage = request.body;
    messagesCollection.updateOne({id: updateMessage['id']}, updatedMessage, function(err, result) {
        console.log("update result:. " + result);

        if (err) {
            console.log("Problem update message in mongodb: " + err);
        } else {
            console.log("Success update message in mongodb");
        }

        for (var i = 0; i < users.length; i++) {
            if (users[i].screenId == parseInt(updatedMessage['screen'])) {
                users[i].emit('updateMessage', updatedMessage);
            }
        }

        response.end();
    })
});


app.delete("/messages/:messageId", function(request, response){
    var newMessage = request.body;

    messagesCollection.find({id:parseInt(request.params.messageId)},{screen:1}).toArray(function(err, message) {
        messagesCollection.deleteOne({id:parseInt(request.params.messageId)}, function(err, result) {
            if(err){
                console.log("Problem delete message from mongodb: " + err);
            }else{
                console.log("Success delete message from mongodb");
            }

            for(var i = 0; i< users.length; i++){
                if(users[i].screenId == message[0]['screen']){
                    console.log(message[0]['screen']);
                    users[i].emit('deleteMessage', request.params.messageId);
                }
            }

            response.end();
        });
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('addUser', function(screenId){
        socket.screenId = screenId;
    });
    users.push(socket);
});

server.listen(8081);
app.listen(8080);
console.log("server is up");