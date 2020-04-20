'use strict';

var path = require('path');
var http = require('http');

var oas3Tools = require('oas3-tools');
var serverPort = 3000;

// swaggerRouter configuration
var options = {
    controllers: path.join(__dirname, './controllers')
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
expressAppConfig.addValidator();
var app = expressAppConfig.getApp();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Methods", "*");
  //res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

