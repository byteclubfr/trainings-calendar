/* @flow */
/* @jsx React.DOM */

"use strict";


var React = require("react");
var cx = require("react/lib/cx");
var _ = require("lodash");
var moment = require("../lib/moment");
var actions = require("../actions/trainingsActions");


module.exports = React.createClass({

  handleClick(event) {
    actions.addStart({nbDays: 3, subject: "Angular", event: event});
  },

  render() {
    return <button onClick={ this.handleClick }>New training</button>;
  }

});
