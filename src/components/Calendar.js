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
    Reflux.connect(trainingsStores.datesStore,    "dates"),
    Reflux.connect(trainingsStores.holidaysStore, "holidays"),
    Reflux.connect(trainingsStores.weekEndsStore, "weekEnds"),
    Reflux.connect(trainingsStores.trainersStore, "trainers"),
    Reflux.connect(trainingsStores.subjectsStore, "subjects"),
    Reflux.connect(trainingsStores.addingStore,   "adding")
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

      // Updated from stores
      dates:    {}, // {"trainer": {"ymd": {state, trainer, subject, client, days: ["ymd", "ymd"]}}}
      trainers: [],
      subjects: [],
      adding:   null,
      weekEnds: this.props.weekEnds,
      holidays: this.props.holidays
    }
  },

  render() {
    console.log(this.state.dates.min);
    var start = moment(this.state.start || this.state.dates.min, "YYYY-MM");

    if (!start.isValid()) {
      return <span>Invalid start date</span>
    }

    var months = _.range(this.state.months).map(v => moment(start).add(v, "months").locale(this.state.locale));
    var dates = this.state.dates;

    if (this.state.adding && this.state.adding.complete) {
      dates = trainingsStores.datesStore.concat(_.merge({
        "state":    "adding"
      }, this.state.adding));
    }

    return (
      <table className="calendar">
        <CalendarHeader moments={ months } trainers={ this.state.trainers } />
        <tbody>{ _.range(31).map(day =>
          <CalendarRow key={ "R" + day }
            months={ months } day={ day + 1 } dates={ dates.indexed }
            trainers={ this.state.trainers } weekEnds={ this.state.weekEnds } holidays={ this.state.holidays } />
        ) }</tbody>
      </table>
    );
  }

});
