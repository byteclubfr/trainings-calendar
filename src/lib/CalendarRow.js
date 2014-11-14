/* @jsx React.DOM */

"use strict";


var React = require("react");
var moment = require("moment/min/moment-with-locales");

var CalendarCell = require("./CalendarCell");


module.exports = React.createClass({

  renderDay() {
    var day = String(this.props.day);
    if (day.length < 2) {
      day = "0" + day;
    }

    return day;
  },

  renderMonth(month) {
    var date = month.format("YYYY-MM") + "-" + this.props.day;

    if (!moment(date, "YYYY-MM-DD").isValid()) {
      return <td key={ "CI" + date } className="day-invalid" colSpan={ this.props.trainers.length + 1 } />;
    }

    return [
      <td className="day">{ this.renderDay() }</td>,
      this.props.trainers.map(trainer => <CalendarCell key={ "CC" + date + "_" + trainer } trainer={ trainer } date={ date } dates={ this.props.dates } />)
    ];
  },

  render() {
    return (
      <tr>
        { this.props.months.map(this.renderMonth) }
      </tr>
    );
  }

});
