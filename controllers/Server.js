'use strict';

var utils = require('../utils/writer.js');
var Server = require('../service/ServerService');

module.exports.addChallenge = function addChallenge (req, res, next, body) {
  Server.addChallenge(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllChallenges = function getAllChallenges (req, res, next) {
  Server.getAllChallenges()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.startHTML = function startHTML (req, res, next) {
  Server.startHTML()    
    .then(function (response) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(response);
    })
    .catch(function (response) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end(response);
    });
};
