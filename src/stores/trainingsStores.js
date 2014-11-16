"use strict";

var Reflux = require("reflux");
var _ = require("lodash");
var actions = require("../actions/trainingsActions");


exports.datesStore = Reflux.createStore({
  listenables: actions,

  onDatesChange(dates) {
    this.trigger(dates);
  }
});

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
        trainer:  data.trainer,
        startDay: data.date,
        complete: true
      }, _willAdd));
    }
  }
});
