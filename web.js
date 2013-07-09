var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    // response.send('Hello World from Tom Harder!');
    var buf = new Buffer();
    response.send(buf.toString(fs.readFileSync("index.html");););
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});