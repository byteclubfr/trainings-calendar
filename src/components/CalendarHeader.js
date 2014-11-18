/* @flow */
/* @jsx React.DOM */

"use strict";


var React = require("react");
var _ = require("lodash");


module.exports = React.createClass({

  renderYearHeader (nb, year) {
    return <th key={ "HY" + year } colSpan={ nb * (this.props.trainers.length + 2) }>{ year }</th>;
  },

  renderMonthHeader(date) {
    return <th key={ "HM" + date.format("MM") } colSpan={ this.props.trainers.length + 2 }>{ date.format("MMMM") }</th>;
  },

  renderTrainerHeader(id) {
    return function (trainer) {
      return <th className="trainer"><span title={ trainer }>{ trainer[0] }</span></th>;
    };
  },

  renderTrainersHeader(month) {
    var id = "HD" + month.format("YYYY-MM");

    return [
      <th className="day" colSpan="2" />,
      this.props.trainers.map(this.renderTrainerHeader(id))
    ];
  },

  render() {
    var countYears = _.countBy(_.invoke(this.props.moments, "year"));

    return (
      <thead>
        <tr className="years">{ _.map(countYears, this.renderYearHeader) }</tr>
        <tr className="months">{ this.props.moments.map(this.renderMonthHeader) }</tr>
        <tr className="trainers">{ this.props.moments.map(this.renderTrainersHeader) }</tr>
      </thead>
    );
  }
});
