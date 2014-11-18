/* @flow */
/* @jsx React.DOM */

"use strict";

/* eslint no-multi-str:0 */
/* eslint quotes:0 */

var React = require("react");
var moment = require("../lib/moment");
var _ = require("lodash");
var Reflux = require("reflux");
var trainingsStores = require("../stores/trainingsStores");

var CalendarHeader = require("./CalendarHeader");
var CalendarRow = require("./CalendarRow");

type TrainingDate = {
  state:    string;
  trainer:  string;
  subject:  string;
  client:   string;
  days:     Array<string>;
};

type State = {
  locale:   string;
  months:   number;
  start:    string;
  dates:    Array<TrainingDate>;
  trainers: Array<string>;
  subjects: Array<string>;
  adding:   any;
  weekEnds: Array<number>;
  holidays: any;
};


module.exports = React.createClass({

  mixins: [
    Reflux.connect(trainingsStores.datesStore,    "dates"),
    Reflux.connect(trainingsStores.holidaysStore, "holidays"),
    Reflux.connect(trainingsStores.weekEndsStore, "weekEnds"),
    Reflux.connect(trainingsStores.trainersStore, "trainers"),
    Reflux.connect(trainingsStores.subjectsStore, "subjects"),
    Reflux.connect(trainingsStores.addingStore,   "adding")
  ],

  propTypes: {
    months:   React.PropTypes.number,
    start:    React.PropTypes.string,
    locale:   React.PropTypes.string,
    weekEnds: React.PropTypes.arrayOf(React.PropTypes.number),
    holidays: React.PropTypes.objectOf(React.PropTypes.string)
  },

  getDefaultProps() {
    return {
      months: 6,          // Number of visible months
      start:  "",         // automatic from state.dates, or "YYYY-MM"
      locale: "fr",       // Localize datetimes
      weekEnds: [6, 0],   // Sat + Sun
      holidays: {}        // "YYYY-MM-DD": "holiday"
    };
  },

  getInitialState(): State {
    var dates: Array<TrainingDate> = [];
    var trainers: Array<string> = [];
    var subjects: Array<string> = [];
    var adding: ?any = null;

    return {
      locale:   this.props.locale,
      months:   this.props.months,
      start:    this.props.start,

      // Updated from stores
      dates:    dates,
      trainers: trainers,
      subjects: subjects,
      adding:   adding,
      weekEnds: this.props.weekEnds,
      holidays: this.props.holidays
    };
  },

  guessStart(dates: Array<TrainingDate>): string {
    // dates = list of {days: [ "ymd", … ], …}
    // pluck → list of [ "ymd", … ]
    // pluck again → list of "ymd"
    // can't use _.min (numbers only), sort and take first
    return _.filter(_.pluck(_.filter(_.pluck(dates, "days")), 0)).sort()[0];
  },

  render(): any {
    var start = moment(this.state.start || this.guessStart(this.state.dates), "YYYY-MM");

    if (!start.isValid()) {
      return <span>{ "Invalid start date" }</span>;
    }

    var dates = this.state.dates;
    var months = _.range(this.state.months).map(v => moment(start).add(v, "months").locale(this.state.locale));

    if (this.state.adding && this.state.adding.complete) {
      dates = dates.concat({
        "state":    "adding",
        "adding":   this.state.adding.available,
        "trainer":  this.state.adding.trainer,
        "subject":  this.state.adding.subject,
        "client":   this.state.adding.client,
        "days":     this.state.adding.days
      });
    }

    return (
      <table className="calendar">
        <CalendarHeader moments={ months } trainers={ this.state.trainers } />
        <tbody>{ _.range(31).map(day =>
          <CalendarRow key={ "R" + day }
            months={ months } day={ day + 1 } dates={ dates }
            trainers={ this.state.trainers } weekEnds={ this.state.weekEnds } holidays={ this.state.holidays } />
        ) }</tbody>
      </table>
    );
  }

});
