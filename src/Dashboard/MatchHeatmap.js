import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react';

import {getUnsortedRecordByDateArray} from '../redux/selectors'

const MatchHeatmap = ({dateData}) => {

  var dateGraphData = dateData.map((date)=>[date.key, date.total])

  var option = {
    visualMap: {
        show: false,
        min: 0,
        max: 10
    },
    calendar: {
        range: [dateData[0].key, dateData[(dateData.length - 1)].key]
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: dateGraphData
    }
};

  return (
      <ReactEcharts option={option} />
    )
}

const mapStateToProps = (state) => {
  return {
    dateData: getUnsortedRecordByDateArray(state),
  };
}

export default connect(mapStateToProps)(MatchHeatmap)