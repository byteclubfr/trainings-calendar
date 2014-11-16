/* @jsx React.DOM */

"use strict";

var React = require("react");
var Calendar = require("./components/Calendar");
var actions = require("./actions/trainingsActions");


React.render(<Calendar className="toto" />, document.getElementById("calendar"));


var xhr = new XMLHttpRequest();
xhr.open("GET", "/data/calendar-sample.json", true);
xhr.send();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    if (data.dates) {
      actions.datesChange(data.dates);
    }
    if (data.trainers) {
      actions.trainersChange(data.trainers);
    }
    if (data.subjects) {
      actions.subjectsChange(data.subjects);
    }
  }
};
