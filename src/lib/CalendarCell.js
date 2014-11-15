/* @jsx React.DOM */

"use strict";


var React = require("react");
var _ = require("lodash");
var moment = require("./moment");


module.exports = React.createClass({

  getDefaultProps() {
    return {
      dates:    [], // training dates
      trainer:  "", // trainer name
      date:     "", // cell date (String format YYYY-MM-DD)
      weekEnds: []  // days of week always busy
    };
  },

  isTrainer(date) {
    return this.props.trainer === date.trainer;
  },

  isInRange(date) {
    return this.props.date >= date.days[0] && this.props.date <= date.days[1];
  },

  isWeekEnd() {
    return _.contains(this.props.weekEnds, Number(moment(this.props.date, "YYYY-MM-DD").format("d")));
  },

  render() {
    var symbol = "";
    var cls = "date";

    if (this.isWeekEnd()) {
      cls += " weekend";
    } else {
      var found = _.find(_.filter(this.props.dates, this.isTrainer), this.isInRange);
      if (found) {
        symbol = "×";
        cls += " " + found.state;
        if (!found.subject) {
          cls += " no-subject";
        }
      }
    }

    return (
      <td className={ cls }>{ symbol }</td>
    );
  }

});
