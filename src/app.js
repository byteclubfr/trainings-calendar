/* @jsx React.DOM */

"use strict";

var React = require("react");
var Calendar = require("./components/Calendar");
var NewTrainingForm = require("./components/NewTrainingForm");
var actions = require("./actions/trainingsActions");


React.render(<Calendar />, document.getElementById("calendar"));
React.render(<NewTrainingForm />, document.getElementById("new-training-form"));


var xhr = new XMLHttpRequest();
xhr.open("GET", "/data/calendar-sample.json", true);
xhr.send();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    actions.datesChange(data.dates);
    actions.holidaysChange(data.holidays);
    actions.weekEndsChange(data.weekEnds);
    actions.trainersChange(data.trainers);
    actions.subjectsChange(data.subjects);
  }
};
