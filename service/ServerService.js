'use strict';
var list_of_Challenges = [];

/**
 * Adds a Challenge to the list.
 *
 * body Challenge Challenge object that should be added
 * no response value expected for this operation
 **/
exports.addChallenge = function(body) {
  //console.log(body);
  list_of_Challenges.push(body);
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
  //console.log('======================\n'+JSON.stringify(list_of_Challenges));
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
    if ((Object.keys(examples).length > 0)&&(list_of_Challenges.length<1)) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve(list_of_Challenges);
    }
  });
}
