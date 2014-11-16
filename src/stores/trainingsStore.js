"use strict";

var Reflux = require("reflux");
var _ = require("lodash");
var actions = require("../actions/trainingsActions");


var _trainings = {
  dates:    [],
  trainers: [],
  subjects: []
};


module.exports = Reflux.createStore({
  listenables: actions,

  onDatesChange(dates) {
    _trainings.dates = dates;
    this.trigger(_trainings);
  },

  onTrainersChange(trainers) {
    _trainings.trainers = trainers;
    this.trigger(_trainings);
  },

  onSubjectsChange(subjects) {
    _trainings.subjects = subjects;
    this.trigger(_trainings);
  }
});
