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
