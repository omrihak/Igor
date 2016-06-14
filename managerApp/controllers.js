
app.controller('MessagesController', function ($scope, $location, messagesService, images, templates) {
    $scope.filterScreenId = "";
    $scope.filterName = "";
    $scope.images = images;
    $scope.templates = templates;
    getAllMessages();

    function getAllMessages() {
        $scope.messages = messagesService.getMessages();
    } 

    $scope.insertMessage = function () {
        var newMessage = {
            name: $scope.newMessage.name, "texts": [
                $scope.newMessage.text1, $scope.newMessage.text2, $scope.newMessage.text3
            ], "pictures": [
                $scope.newMessage.image1,
                $scope.newMessage.image2
            ],
            "template": $scope.newMessage.template,
            "duration": $scope.newMessage.duration,
            "timeToShow": {
                "startDate": $scope.newMessage.startDate.toLocaleDateString('en-GB'),
                "endDate": $scope.newMessage.endDate.toLocaleDateString('en-GB')
            }
            ,
            "screen": $scope.newMessage.screen,
            "address": $scope.newMessage.address
        };

        messagesService.insertMessage(newMessage).then(function (successResponse) {
            newMessage.id = successResponse.data;
            $scope.messages.push(newMessage);
        }, function (errorResponse) {
            console.log('Error while insert to mongo db:' + errorResponse['data'])
        });

        resetTextBoxes();
    };

    $scope.deleteMessage = function (messageId) {

        messagesService.deleteMessage(messageId).then(function(successResponse){
            for (var i = 0 ; i < $scope.messages.length; i++) {
                if ($scope.messages[i]['id'] == messageId) {
                    $scope.messages.splice(i, 1);
                    break;
                }
            }
        }, function (errorResponse){
            console.log('Error while delete from mongo db:' + errorResponse['data'])
        });
    };

    function resetTextBoxes(){
        $scope.newMessage.name = '';
        $scope.newMessage.text1 = '';
        $scope.newMessage.text2 = '';
        $scope.newMessage.text3 = '';
        $scope.newMessage.image1 = '';
        $scope.newMessage.image2 = '';
        $scope.newMessage.template = '';
        $scope.newMessage.duration = '';
        $scope.newMessage.startDate = '';
        $scope.newMessage.endDate = '';
        $scope.newMessage.screen = '';
        $scope.newMessage.address = '';
    }
});

app.controller('EditMessageController', function ($scope, $routeParams, messagesService, images, templates) {
    $scope.images = images;
    $scope.templates = templates;

    getMessage();

    function getMessage() {
        messagesService.getMessageById($routeParams.id).then(function(result){
           if(result.data.length == 0){
               alert('There is no message with id' + $routeParams.id);
           }else{
               $scope.message = result.data[0];
               $scope.startDate = parseDMY($scope.message.timeToShow.startDate);
               $scope.endDate = parseDMY($scope.message.timeToShow.endDate);
           }
        });
    }

    $scope.updateMessage = function() {
        var a = $scope.message;
        a.timeToShow.startDate = $scope.startDate.toLocaleDateString('en-GB');
        a.timeToShow.endDate = $scope.endDate.toLocaleDateString('en-GB');
        messagesService.updateMessage($scope.message.id, a);
    };

    function parseDMY(value) {
        var date = value.split("/");
        var d = parseInt(date[0], 10),
            m = parseInt(date[1], 10),
            y = parseInt(date[2], 10);
        return new Date(y, m - 1, d);
    }
});

app.controller('MessagesScreenGraphController', function ($scope, messagesService, $http) {
 var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#screenGraphDiv").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	$http({
  method: 'GET',
  url: '/amountMessagesPerScreen'
}).then(function successCallback(response) {
	var data = response.data.sort(function(a, b){return a._id-b._id});
	
	x.domain(data.map(function(d) { return d._id; }));
	  y.domain([0, d3.max(data, function(d) { return d.count; })]);
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		  .append("text")
		  .attr("y", 6)
		  .attr("x", 30)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Screen Id");

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Messages");

	  svg.selectAll(".bar")
		  .data(data)
		.enter().append("rect")
		  .attr("class", "bar")
		  .attr("x", function(d) { return x(d._id); })
		  .attr("width", x.rangeBand())
		  .attr("y", function(d) { return y(d.count); })
		  .attr("height", function(d) { return height - y(d.count); });
  }, function errorCallback(response) {
		throw "error";
  });

	function type(d) {
	  d.frequency = +d.frequency;
	  return d;
	}

})
.directive('messagesScreenGraph', function() {
  return {
    template: '<div id="screenGraphDiv"></div>'
  };
});

app.controller('MessagesDatesGraphController', function ($scope, messagesService, $http) {
	
		function isItTimeToShowMessage(timesToShow, checkDate) {
			var isItTime = false;
			var startDate = convertStringToDate(timesToShow.startDate);
			var endDate = convertStringToDate(timesToShow.endDate);

			if (checkDate >= startDate &&
				checkDate <= endDate) {
				isItTime = true;
			}

			return isItTime;
		}

		function convertStringToDate(dateString) {
			if (dateString == '')
				return null;

			var parsedDate = new Date();
			parsedDate.setFullYear(dateString.substr(6, 4), dateString.substr(3, 2) - 1, dateString.substr(0, 2));

			return parsedDate;
		}
		
		
		 // Set the dimensions of the canvas / graph
		var margin = {top: 30, right: 20, bottom: 30, left: 50},
			width = 600 - margin.left - margin.right,
			height = 270 - margin.top - margin.bottom;

		// Parse the date / time
		var parseDate = d3.time.format("%d-%b-%y").parse;

		// Set the ranges
		var x = d3.time.scale().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		// Define the axes
		var xAxis = d3.svg.axis().scale(x)
			.orient("bottom").ticks(5);

		var yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(5);

		// Define the line
		var valueline = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.count); });
			
		// Adds the svg canvas
		var svg = d3.select("#datesGraphDiv")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", 
					  "translate(" + margin.left + "," + margin.top + ")");
					  
					  
		messagesService.getMessagesPromise().then(function(messages){
			var now = new Date();
			var messagesPerDate = [];
			for (var d = new Date("January 1, 2016"); d < new Date("January 1, 2017"); d.setDate(d.getDate() + 10)) {
				var count = 0;
				messages.data.forEach(function(message){
					if(isItTimeToShowMessage(message.timeToShow, d))
					{
						count++;
					}
				});
				messagesPerDate.push({'date' : new Date(d), 'count' : count});
			}
			
			
			
			x.domain(d3.extent(messagesPerDate, function(d) { return d.date; }));
			y.domain([0, d3.max(messagesPerDate, function(d) { return d.count; })]);
			
			
			 // Add the valueline path.
			 svg.append("path")
				 .attr("class", "line")
				 .attr("d", valueline(messagesPerDate));

			 // Add the X Axis
			 svg.append("g")
				 .attr("class", "x axis")
				 .attr("transform", "translate(0," + height + ")")
				 .call(xAxis);

			 // Add the Y Axis
			 svg.append("g")
				 .attr("class", "y axis")
				 .call(yAxis).append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text("Messages");
					});
		
	

})
.directive('messagesDatesGraph', function() {
  return {
    template: '<div id="datesGraphDiv"></div>'
  };
});

