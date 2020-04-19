'use strict';

var utils = require('../utils/writer.js');
var Server = require('../service/ServerService');
var path=require('path');

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

module.exports.serveIndexHTML = function serveIndexHTML (req, res, next) {
  res.sendFile('index.html',{root:path.join(__dirname,'../public')});
};

module.exports.servePublicFile = function servePublicFile (req, res, next, publicfilename) {
  res.sendFile(publicfilename,{root:path.join(__dirname,'../public')});
};
