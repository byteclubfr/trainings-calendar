/* @jsx React.DOM */

"use strict";


var React = require("react");
var cx = require("react/lib/cx");
var _ = require("lodash");
var moment = require("../lib/moment");
var actions = require("../actions/trainingsActions");


module.exports = React.createClass({

  getDefaultProps() {
    return {
      dates:    [], // training dates
      trainer:  "", // trainer name
      date:     "", // cell date (String format YYYY-MM-DD)
      weekEnds: [], // days of week always busy
      holidays: {}  // "YYYY-MM-DD": "holiday"
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

  isHoliday() {
    return !!this.props.holidays[this.props.date];
  },

  handleMouseOver(event) {
    actions.addChange({date: this.props.date, trainer: this.props.trainer, event: event});
  },

  render() {
    var symbol = "";
    var holiday = this.isHoliday();
    var weekend = this.isWeekEnd();

    var cls = {
      "date":     true,
      "holiday":  holiday,
      "weekend":  weekend
    };

    if (!holiday && !weekend) {
      var found = _.find(_.filter(this.props.dates, this.isTrainer), this.isInRange);
      if (found) {
        symbol = "×";
        cls[found.state] = true;
        cls["no-subject"] = !found.subject;
      }
    }

    return (
      <td className={ cx(cls) } onMouseOver={ this.handleMouseOver }>{ symbol }</td>
    );
  }

});
