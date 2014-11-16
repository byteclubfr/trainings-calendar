/* @jsx React.DOM */

"use strict";


var React = require("react");
var moment = require("../lib/moment");
var _ = require("lodash");
var Reflux = require("reflux");
var trainingsStores = require("../stores/trainingsStores");

var CalendarHeader = require("./CalendarHeader");
var CalendarRow = require("./CalendarRow");


module.exports = React.createClass({

  mixins: [
    Reflux.connect(trainingsStores.datesStore, "dates"),
    Reflux.connect(trainingsStores.trainersStore, "trainers"),
    Reflux.connect(trainingsStores.subjectsStore, "subjects")
  ],

  getDefaultProps() {
    return {
      months: 6,          // Number of visible months
      start:  null,       // automatic from state.dates, or [year, month]
      locale: "fr",       // Localize datetimes
      weekEnds: [6, 0],   // Sat + Sun
      holidays: {}        // "YYYY-MM-DD": "holiday"
    };
  },

  getInitialState() {
    return {
      locale:   this.props.locale,
      months:   this.props.months,
      start:    this.props.start,
      weekEnds: this.props.weekEnds,
      holidays: this.props.holidays,
      willAdd:  null, // {subject, nbDays} → set from other component
      adding:   null, // {trainer, [subject], [client], startDay, nbDays}

      // Updated from store
      dates:    [],
      trainers: [],
      subjects: []
    }
  },

  guessStart(dates) {
    // dates = list of {days: [ "ymd", … ], …}
    // pluck → list of [ "ymd", … ]
    // pluck again → list of "ymd"
    // can't use _.min (numbers only), sort and take first
    return _.filter(_.pluck(_.filter(_.pluck(dates, "days")), 0)).sort()[0];
  },

  handleOverCell(date, trainer, event) {
    if (this.state.willAdd) {
      this.setState({
        adding: {trainer: trainer, startDay: date, nbDays: this.state.willAdd.nbDays, subject: this.state.willAdd.subject}
      });
    }
  },

  render() {
    var start = moment(this.state.start || this.guessStart(this.state.dates), "YYYY-MM");

    if (!start.isValid()) {
      return <span>Invalid start date</span>
    }

    var months = _.range(this.state.months).map(v => moment(start).add(v, "months").locale(this.state.locale));
    var dates = this.state.dates;

    if (this.state.adding) {
      var endDay = moment(this.state.adding.startDay, "YYYY-MM-DD").add(this.state.adding.nbDays - 1, "days").format("YYYY-MM-DD");
      dates = dates.concat({
        "state":    "unconfirmed",
        "trainer":  this.state.adding.trainer,
        "subject":  this.state.adding.subject,
        "client":   this.state.adding.client,
        "days":     [this.state.adding.startDay, endDay]
      });
    }

    return (
      <table className="calendar">
        <CalendarHeader moments={ months } trainers={ this.state.trainers } />
        <tbody>{ _.range(31).map(day =>
          <CalendarRow key={ "R" + day }
            months={ months } day={ day + 1 } dates={ dates }
            onOverCell={ this.handleOverCell }
            trainers={ this.state.trainers } weekEnds={ this.state.weekEnds } holidays={ this.state.holidays } />
        ) }</tbody>
      </table>
    );
  }

});
