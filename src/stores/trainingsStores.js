"use strict";

var Reflux = require("reflux");
var _ = require("lodash");
var moment = require("../lib/moment");
var actions = require("../actions/trainingsActions");


var _dates = null;

function _range(start, endDayOrNbDays) {
  var start = moment(start, "YYYY-MM-DD");
  if (_.isNumber(endDayOrNbDays)) {
    return _.range(endDayOrNbDays).map(v => moment(start).add(v, "days"));
  } else {
    var end = moment(endDayOrNbDays, "YYYY-MM-DD");
    return [start].concat(_.range(end.diff(start, "days") - 2).map(v => moment(start).add(v + 1, "days"))).concat([end]);
  }
}

// Date: {state, trainer, subject, client, days: ["ymd", "ymd"]}
exports.datesStore = Reflux.createStore({
  listenables: actions,

  range: _range,

  // input:  Date
  // output: {"ymd": Date}
  indexedDate(date) {
    var range = this.range(date.days[0], date.days[1]);
    var keys = _.invoke(range, "format", "YYYY-MM-DD");
    var values = _.map(range, _.constant(date));

    return _.object(keys, values);
  },

  // input:  [Date]
  // output: [Date, indexed: {"trainer": {"ymd": Date}}, min: "ymd"]
  onDatesChange(dates) {
    var indexed = _.reduce(dates, (index, date) => _.merge(index, _.object([date.trainer], [this.indexedDate(date)])), {});
    var min = _.min(_.pluck(_.pluck(dates, "days"), 0), function (d) { return Number(d.replace(/-/g, '')) });

    _dates = _.merge(dates, {
      "indexed":  indexed,
      "min":      min
    });

    console.log("INDEX", indexed);

    this.trigger(_dates);
  },

  concat(date) {
    if (!date.days) {
      // No "days" field: supposed to be guessable from "startDay" and "nbDays"
      var start, mStart;
      if (date.startDay) {
        start = date.startDay;
        mStart = moment(start, "YYYY-MM-DD");
      } else {
        mStart = moment();
        start = mStart.format("YYYY-MM-DD");
      }
      var end = mStart.add((date.nbDays || 1) - 1, "days").format("YYYY-MM-DD");
      console.log(start, end);
      date.days = [start, end];
    }

    var dates = (_dates || []).concat([date]);
    var indexed = (_dates && _.clone(_dates.indexed)) || {};
    var min = (_dates && _dates.min) || date.days[0];

    if (date.days[0] < min) {
      min = date.days[0];
    }

    return _.merge(dates, {
      "indexed":  _.merge(indexed, _.object([date.trainer], [this.indexedDate(date)])),
      "min":      min
    });
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
  var range = _range(startDay, nbDays);

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
