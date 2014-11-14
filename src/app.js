/* @jsx React.DOM */

"use strict";

var React = require("react");
var Calendar = require("./lib/Calendar");


var calendar = React.render(<Calendar className="toto" />, document.getElementById("calendar"));

var xhr = new XMLHttpRequest();
xhr.open("GET", "/data/calendar-sample.json", true);
xhr.send();
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    calendar.setState(JSON.parse(xhr.responseText));
  }
};
