'use strict';


/**
 * Adds a Challenge to the list.
 *
 * body Challenge Challenge object that should be added
 * no response value expected for this operation
 **/
exports.addChallenge = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Gets list of all Challgenges.
 *
 * returns List
 **/
exports.getAllChallenges = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "id" : "id",
  "list" : [ {
    "A" : "A",
    "B" : "B"
  }, {
    "A" : "A",
    "B" : "B"
  } ]
}, {
  "id" : "id",
  "list" : [ {
    "A" : "A",
    "B" : "B"
  }, {
    "A" : "A",
    "B" : "B"
  } ]
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

