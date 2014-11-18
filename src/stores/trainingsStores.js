"use strict";

var Reflux = require("reflux");
var _ = require("lodash");
var moment = require("../lib/moment");
var actions = require("../actions/trainingsActions");


var _willAdd = null, _adding = null;

exports.addingStore = Reflux.createStore({
  listenables: actions,

  onAddStart(data) {
    _willAdd = {
      nbDays:   data.nbDays,
      subject:  data.subject,
      client:   data.client
    };

    this.trigger(_.merge({ complete: false }, _willAdd));
  },

  onAddChange(data) {
    if (_willAdd) {
      var start = moment(data.date, "YYYY-MM-DD");
      var end = moment(start).add(_willAdd.nbDays - 1, "days");
      _adding = {
        trainer:    data.trainer,
        days:       [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")],
        subject:    _willAdd.subject,
        client:     _willAdd.client,
        available:  _availability(data.trainer, data.date, _willAdd.nbDays),
      };

      this.trigger(_.merge({ complete: true }, _adding));
    }
  },

  onAddEnd() {
    _willAdd = null;
    _adding = null;

    this.trigger({complete: false});
  }
});



var _dates = null;

exports.datesStore = Reflux.createStore({
  listenables: actions,

  onDatesChange(dates) {
    _dates = dates;

    this.trigger(_dates);
  },

  onDatesAdd(date) {
    if (!date && _adding && _adding.available.available) {
      date = _adding;
    }

    if (date) {
      _dates.push(_.merge({ state: "unconfirmed" }, date));

      this.trigger(_dates);
    }
  }
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
      return {available: false, reason: "week-end"};
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
