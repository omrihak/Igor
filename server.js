var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/advertisements';
var mongoDB;
var users = [];
mongoClient.connect(mongoUrl, function(err, db) {
    if(err){
        console.log("Problem with connecting to mongodb. " + err);
    }else{
        mongoDB = db;
        console.log("Connected correctly to server.");
    }
});

app.use(express.static(__dirname));
app.get("/screen=:screen", function(request, response) {
    response.sendfile(__dirname + "/main.html")
});

app.get("/messages/screen=:screen", function(request, response){
    mongoDB.collection('messages').find({screens:parseInt(request.params.screen)}).toArray(function(err, messages) {
        response.json(messages);
        response.end();
    });
});

app.get("/messages", function(request, response){
    mongoDB.collection('messages').find().toArray(function(err, messages) {
        response.json(messages);
        response.end();
    });
});

app.get("/manager", function(request, response){
    response.sendfile(__dirname + "/app/manager.html")
});

app.get("/TestUpdate", function(request, response){
    var newMessage = {"name": "message 5","texts": ["hiiiiiiiiii"], "pictures": ["pictures/unicorn.jpg"],"template": "templates/templateB.html",
        "duration": 1,"timeToShow": [{"startDate": "01/04/2016","endDate": "30/07/2016","daysInWeek": [2, 3, 4, 5],"startHour": "01:00","endHour": "23:00"
        }],"screens":[parseInt(request.query.id)]};

    mongoDB.collection('messages').insertOne(newMessage, function(err, result) {
        if(err){
            console.log("Problem add new message to mongodb. " + err);
        }else{
            console.log("Success add new message to mongodb");
        }

        for(var i = 0; i< users.length; i++){
            if(users[i].screenId == parseInt(request.query.id)){
                users[i].emit('newMessage',newMessage);
            }
        }

        response.end();
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