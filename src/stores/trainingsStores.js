"use strict";

var Reflux = require("reflux");
var _ = require("lodash");
var moment = require("../lib/moment");
var actions = require("../actions/trainingsActions");


var _dates = null;

exports.datesStore = Reflux.createStore({
  listenables: actions,

  onDatesChange(dates) {
    _dates = dates;
    this.trigger(dates);
  },
});

var _holidays = null;

exports.holidaysStore = Reflux.createStore({
  listenables: actions,

  onHolidaysChange(holidays) {
    _holidays = holidays;
    this.trigger(holidays);
  },
});

var _weekEnds = [0, 6];

exports.weekEndsStore = Reflux.createStore({
  listenables: actions,

  onWeekEndsChange(weekEnds) {
    _weekEnds = weekEnds;
    this.trigger(weekEnds);
  },
});


// returns {available:Boolean, reason:String}
function _availability(trainer, startDay, nbDays) {
  var startDate = moment(startDay, "YYYY-MM-DD");
  var range = _.range(nbDays).map(v => moment(startDate).add(v, "days"));

  // Week-End in range?
  if (_weekEnds && _weekEnds.length) {
    if (_.any(range, d => _.contains(_weekEnds, Number(d.format("d"))))) {
      return {available: false, reason: "week-end"}
    }
  }

  // Public holiday in range?
  if (_holidays) {
    var holiday = _.find(range, d => _holidays[d.format("YYYY-MM-DD")]);
    if (holiday) {
      return {available: false, reason: "holiday"};
    }
  }

  // Busy or confirmed in range?
  var endDay = range[1].format("YYYY-MM-DD");
  var trainerDatesInRange = _.filter(_dates || [], d => d.trainer === trainer && d.days[1] >= startDay && d.days[0] <= endDay);

  if (_.any(trainerDatesInRange, {state: "busy"})) {
    return {available: false, reason: "busy"};
  }

  if (_.any(trainerDatesInRange, {state: "confirmed"})) {
    return {available: false, reason: "confirmed"};
  }

  // Unconfirmed or totally unplanned day?
  return {
    available: true,
    reason:    _.any(trainerDatesInRange, {state: "unconfirmed"}) ? "unconfirmed" : "unplanned"
  };
}



exports.trainersStore = Reflux.createStore({
  listenables: actions,

  onTrainersChange(trainers) {
    this.trigger(trainers);
  }
});

exports.subjectsStore = Reflux.createStore({
  listenables: actions,

  onSubjectsChange(subjects) {
    this.trigger(subjects);
  }
});



var _willAdd = null;

exports.addingStore = Reflux.createStore({
  listenables: actions,

  onAddStart(data) {
    _willAdd = {
      nbDays:   data.nbDays,
      subject:  data.subject
    };

    this.trigger(_.merge({
      complete: false,
    }, _willAdd));
  },

  onAddChange(data) {
    if (_willAdd) {
      this.trigger(_.merge({
        trainer:    data.trainer,
        startDay:   data.date,
        available:  _availability(data.trainer, data.date, _willAdd.nbDays),
        complete:   true
      }, _willAdd));
    }
  }
});
