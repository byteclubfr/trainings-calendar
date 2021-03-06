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

  handleClick(event) {
    if (this._found && this._found.adding && this._found.adding.available) {
      actions.datesAdd();
      actions.addEnd();
    }
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

    var found = this._found = _.findLast(_.filter(this.props.dates, this.isTrainer), this.isInRange);

    if (found && !found.adding && (holiday || weekend)) {
      // adding date > holiday & weekend > normal date
      found = null;
    }

    if (found) {
      symbol = "×";
      cls[found.state] = true;
      cls["no-subject"] = !found.subject;

      if (found.adding) {
        cls["valid"] = found.adding.available;
        cls["invalid"] = !found.adding.available;
        cls[found.adding.reason] = true;
        if (!found.adding.available) {
          symbol = "ø";
        }
      }
    }

    return (
      <td className={ cx(cls) } onMouseOver={ this.handleMouseOver } onClick={ this.handleClick }>{ symbol }</td>
    );
  }

});
