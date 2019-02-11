import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react';
import format from 'date-fns/format'
import setDay from 'date-fns/set_day'
import setHours from 'date-fns/set_hours'

import {getColorForWinrate} from '../util'

import {getUnsortedRecordByWeekdayThenHourArray} from '../redux/selectors'

var hoursLabels = [];
var daysLabels = [];

var now = new Date();

for (let i = 0; i<24;i++) {
  hoursLabels.push(format(setHours(now,i),'h a'))
}

// TODO, this is displaying days in reverse order
for (let i = 0; i<7;i++) {
  daysLabels.push(format(setDay(now,i),'dddd'))
}

const MIN_PUNCH_SIZE = 6;
const MAX_PUNCH_SIZE = 30;

const MatchesPunchcard = ({weekdayHourData}) => {


  var data = weekdayHourData.map((matchGroup)=>[ parseInt(matchGroup.hour), parseInt(matchGroup.weekday), matchGroup.total, matchGroup.winrate])

  var maxMatches = Math.max(...weekdayHourData.map((matchGroup)=>matchGroup.total))

  var PUNCH_MULTIPLIER = (MAX_PUNCH_SIZE - MIN_PUNCH_SIZE) / maxMatches;

var option = {
    title: {
        text: 'Punch Card of Github',
        link: 'https://github.com/pissang/echarts-next/graphs/punch-card'
    },
    legend: {
        data: ['Punch Card'],
        left: 'right'
    },
    tooltip: {
        position: 'top',
        formatter: function (params) {
            return `winrate of ${params.value[3]} in ${params.value[2]} matches`
        }
    },
    grid: {
        left: 2,
        bottom: 10,
        right: 10,
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: hoursLabels,
        boundaryGap: false,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#999',
                type: 'dashed'
            }
        },
        axisLine: {
            show: false
        }
    },
    yAxis: {
        type: 'category',
        data: daysLabels,
        axisLine: {
            show: false
        }
    },
    series: [{
        name: 'Punch Card',
        type: 'scatter',
        symbolSize: function (val) {
            return val[2] * PUNCH_MULTIPLIER + MIN_PUNCH_SIZE;
        },
        data: data,
        animationDelay: function (idx) {
            return idx * 5;
        },
        itemStyle: {
            normal: {
                color: function (param) {
                    return getColorForWinrate(param.data[3])
                },
                opacity: 0.8
              }

        }
    }]
};


  return (
      <ReactEcharts option={option} />
    )
}


const mapStateToProps = (state) => {
  return {
    weekdayHourData: getUnsortedRecordByWeekdayThenHourArray(state)
  };
}

export default connect(mapStateToProps)(MatchesPunchcard)