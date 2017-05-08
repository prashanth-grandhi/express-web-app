var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

// Define the port to run on
app.set('port', 8081);

// Parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.post('/process_post', function(req, res) {
    var jsonData = JSON.stringify(req.body);
    console.log("Json data: " + jsonData + "\n");

    filePath = path.join(__dirname, 'public/paths.json');
    fs.writeFile(filePath, jsonData, function() {
        res.end("Json saved to paths.json");
    });
});

// Listen for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});
