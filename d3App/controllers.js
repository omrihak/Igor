app.controller('D3Controller', function($scope){

});

app.controller('MessagesScreenGraphController', function ($scope, $http) {
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
		var data = response.data.sort(function (a, b) {
			return a._id - b._id
		});

		x.domain(data.map(function (d) {
			return d._id;
		}));
		y.domain([0, d3.max(data, function (d) {
			return d.count;
		})]);
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
			.attr("x", function (d) {
				return x(d._id);
			})
			.attr("width", x.rangeBand())
			.attr("y", function (d) {
				return y(d.count);
			})
			.attr("height", function (d) {
				return height - y(d.count);
			});
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

app.controller('MessagesDatesGraphController', function ($scope, $http) {

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

	createGraph('/messages', 'GET');

	$scope.filter1 = function () {
		createGraph('/messagesFilter1', 'POST');
	};

	$scope.filter2 = function () {
		createGraph('/messagesFilter2', 'POST');
	};

	function createGraph(urlForData, type) {
		angular.element(document.querySelector('#datesGraphDiv'))[0].innerHTML = "";

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
			.x(function (d) {
				return x(d.date);
			})
			.y(function (d) {
				return y(d.count);
			});

		// Adds the svg canvas
		var svg = d3.select("#datesGraphDiv")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

		var filterData = {};

		if ($scope.data) {
			filterData = $scope.data;
		}
		var request = {
			method: type,
			url: urlForData
		};

		if (filterData) {
			request.data = filterData
		}
		$http(request)
			.then(function (messages) {
				var now = new Date();
				var messagesPerDate = [];
				for (var d = new Date("January 1, 2016"); d < new Date("January 1, 2017"); d.setDate(d.getDate() + 10)) {
					var count = 0;
					messages.data.forEach(function (message) {
						if (isItTimeToShowMessage(message.timeToShow, d)) {
							count++;
						}
					});
					messagesPerDate.push({'date': new Date(d), 'count': count});
				}

				x.domain(d3.extent(messagesPerDate, function (d) {
					return d.date;
				}));
				y.domain([0, d3.max(messagesPerDate, function (d) {
					return d.count;
				})]);

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
	}

})
    .directive('messagesDatesGraph', function() {
		return {
			template: '<div id="datesGraphDiv"></div>' +
			'<div class="row">' +
			'<div class="span3">' +
			'Name:' +
			'					<br />' +
			'<input ng-model="data.name" type="text" placeholder="Name" />' +
			'</div>' +
			'<div class="span3">' +
			'Minimum duration:' +
			'<br />' +
			'<input data-ng-model="data.duration" type="number" placeholder="Duration" />' +
			'</div>' +
			'<div class="span3">' +
			'Screen:' +
			'<br />' +
			'<input ng-model="data.screen" type="number" placeholder="Screen" />' +
			'</div>' +
			'<button style="height: 50px;" ng-click="filter1()">Filter</button>' +
			'</div>' +

			'<div class="row">' +
			'<div class="span3">' +
			'Picture amount:' +
			'					<br />' +
			'<input ng-model="data.pictures" type="number" placeholder="Picture amount" />' +
			'</div>' +
			'<div class="span3">' +
			'Texts amount:' +
			'<br />' +
			'<input data-ng-model="data.texts" type="number" placeholder="Texts amount" />' +
			'</div>' +
			'<div class="span3">' +
			'Adress:' +
			'<br />' +
			'<input ng-model="data.address" type="text" placeholder="Adress" />' +
			'</div>' +
			'<button style="height: 50px;" ng-click="filter2()">Filter</button>' +
			'</div>'
		};
	});

