/* @jsx React.DOM */

"use strict";


var React = require("react");
var _ = require("lodash");


module.exports = React.createClass({

  isTrainer(date) {
    return this.props.trainer === date.trainer;
  },

  isInRange(date) {
    return this.props.date >= date.days[0] && this.props.date <= date.days[1];
  },

  render() {
    var symbol = "";
    var cls = "date";

    var found = _.find(_.filter(this.props.dates, this.isTrainer), this.isInRange);
    if (found) {
      symbol = "×";
      cls += " " + found.state;
      if (!found.subject) {
        cls += " no-subject";
      }
    }

    return (
      <td className={ cls }>{ symbol }</td>
    );
  }

});
