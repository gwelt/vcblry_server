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
  "id" : "Tiere / animals",
  "list" : [ {
    "A" : "Hund",
    "B" : "dog"
  }, {
    "A" : "Katze",
    "B" : "cat"
  }, {
    "A" : "Maus",
    "B" : "mouse"
  } ]
}, {
  "id" : "Fahrzeuge / vehicles",
  "list" : [ {
    "A" : "Auto",
    "B" : "car"
  }, {
    "A" : "Flugzeug",
    "B" : "plane"
  } ]
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

