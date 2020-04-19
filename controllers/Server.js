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

module.exports.servePublicFile = function servePublicFile (req, res, next, publicfilename) {
  res.sendFile(publicfilename||'index.html',{root:path.join(__dirname,'../public')},
      (err) => {if (err) {res.status(err.status).end();next();} else {}}
    );
};
