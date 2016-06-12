$(document).ready(function () {
    init();
});

var index = -1;
    var messages;
    var screen = window.location.href.split('=')[1];

    var canvas;
    var ctx;
    var canvasWidth = 60;
    var canvasHeight = 60;

    var circleR = 30;
    var timeout = 0;
    var often = 15;

    function init() {
        if (location.hash)
            often = 5;
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        drawLines();
    }

    function drawLines() {
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        for (var i = 0; i < 25; i++) {
            for (var a = -45; a <= 45; a += often) {
                setTimeout("drawTimeout(" + a + ");", 100 * timeout);
                timeout++;
            }
        }
    }

    function drawTimeout(a) {
        ctx.beginPath();
        ctx.moveTo(0, circleR);
        var radians = Math.PI / 180 * a;
        var x = (circleR * Math.sin(radians)) / Math.sin(Math.PI / 2 - radians);
        ctx.lineTo(x, 0);

        if (Math.abs(a) == 45) {
            ctx.strokeStyle = "rgb(255,255,255)";
            ctx.lineWidth = 1;
        } else if (a == 0) {
            ctx.strokeStyle = "rgb(200,200,200)";
            ctx.lineWidth = 0.5;
        } else {
            ctx.strokeStyle = "rgb(110,110,110)";
            ctx.lineWidth = 0.2;
        }
        ctx.stroke();
        ctx.rotate((Math.PI / 180) * 15);
    }

    function redirect() {
        if (window.location.hash) window.location.href = '';
        else window.location.href = '#more';
        window.location.reload(true);
    }
