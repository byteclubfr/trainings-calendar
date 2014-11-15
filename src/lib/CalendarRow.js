/* @jsx React.DOM */

"use strict";


var React = require("react");
var moment = require("./moment");

var CalendarCell = require("./CalendarCell");


module.exports = React.createClass({

  getDefaultProps() {
    return {
      months: [],   // visible months, instances of moment
      day:    1,    // day of month
      dates:  [],   // training dates
      trainers: [], // trainers names
      weekEnds: []  // days of week always busy
    };
  },

  renderDay() {
    var day = String(this.props.day);
    if (day.length < 2) {
      day = "0" + day;
    }

    return day;
  },

  renderMonth(month) {
    var dayOfMonth = String(this.props.day);
    if (dayOfMonth.length < 2) {
      dayOfMonth = "0" + dayOfMonth;
    }

    var date = month.format("YYYY-MM") + "-" + dayOfMonth;
    var mDate = moment(date, "YYYY-MM-DD").locale(month.locale());

    if (!mDate.isValid()) {
      return <td key={ "CI" + date } className="day day-invalid" colSpan={ this.props.trainers.length + 2 } />;
    }

    var dayOfWeek = mDate.format("dd");

    return [
      <td className="day day-of-week">{ dayOfWeek }</td>,
      <td className="day day-of-month">{ dayOfMonth }</td>,
      this.props.trainers.map(trainer =>
        <CalendarCell key={ "CC" + date + "_" + trainer } trainer={ trainer } date={ date } dates={ this.props.dates } weekEnds={ this.props.weekEnds } />
      )
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
