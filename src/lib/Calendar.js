/* @jsx React.DOM */

"use strict";


var React = require("react");
var moment = require("moment/min/moment-with-locales");
var _ = require("lodash");

var CalendarHeader = require("./CalendarHeader");
var CalendarRow = require("./CalendarRow");


module.exports = React.createClass({

  getDefaultProps() {
    return {
      months: 6,
      start:  null, // automatic from state.dates, or [year, month]
      locale: "fr"
    };
  },

  getInitialState() {
    return {
      locale:   this.props.locale,
      trainers: [],
      subjects: [],
      dates:    [],
      months:   this.props.months,
      start:    this.props.start
    }
  },

  guessStart(dates) {
    // dates = list of {days: [ "ymd", … ], …}
    // pluck → list of [ "ymd", … ]
    // pluck again → list of "ymd"
    // can't use _.min (numbers only), sort and take first
    return _.filter(_.pluck(_.filter(_.pluck(dates, "days")), 0)).sort()[0];
  },

  render() {
    var start = moment(this.state.start || this.guessStart(this.state.dates), "YYYY-MM");

    if (!start.isValid()) {
      return <span>Invalid start date</span>
    }

    var months = _.range(this.state.months).map(v => moment(start).add(v, "months").locale(this.state.locale));
    var dates = this.state.dates;

    return (
      <table className="calendar">
        <CalendarHeader moments={ months } trainers={ this.state.trainers } />
        <tbody>
          { _.range(31).map(day => <CalendarRow key={ "R" + day } months={ months } day={ day + 1 } dates={ dates } trainers={ this.state.trainers } />) }
        </tbody>
      </table>
    );
  }

});
