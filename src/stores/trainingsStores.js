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
