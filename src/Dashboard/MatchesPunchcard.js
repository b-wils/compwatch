import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react';
import format from 'date-fns/format'
import setDay from 'date-fns/set_day'
import setHours from 'date-fns/set_hours'

import {getColorForWinrate} from '../util'

import {getUnsortedRecordByWeekdayThenHourArray, getUnsortedRecordByDayArray, getUnsortedRecordByHourArray} from '../redux/selectors'

var hoursLabels = ['All Days'];
var daysLabels = ['All Hours'];

var now = new Date();

for (let i = 0; i<24;i++) {
  hoursLabels.push(format(setHours(now,i),'h a'))
}

// TODO, this is displaying days in reverse order
for (let i = 0; i<7;i++) {
  daysLabels.push(format(setDay(now,i),'dddd'))
}

const MIN_PUNCH_SIZE = 6;
const MAX_PUNCH_SIZE = 28;

const MatchesPunchcard = ({weekdayHourData, hourData, weekdayData}) => {

  var maxMatches = Math.max(...weekdayHourData.map((matchGroup)=>matchGroup.total))
  var PUNCH_MULTIPLIER = (MAX_PUNCH_SIZE - MIN_PUNCH_SIZE) / maxMatches;
  var data = weekdayHourData.map((matchGroup)=>[ parseInt(matchGroup.hour) + 1, parseInt(matchGroup.weekday) + 1, matchGroup.total, matchGroup.winrate, PUNCH_MULTIPLIER])


  var maxMatchesHour = Math.max(...hourData.map((matchGroup)=>matchGroup.total))
  var HOUR_PUNCH_MULTIPLIER = (MAX_PUNCH_SIZE - MIN_PUNCH_SIZE) / maxMatchesHour;
  var hourOptionData = hourData.map((matchGroup) => [parseInt(matchGroup.hour) + 1, 0, matchGroup.total, matchGroup.winrate, HOUR_PUNCH_MULTIPLIER])

  var maxMatchesDay = Math.max(...weekdayData.map((matchGroup)=>matchGroup.total))
  var DAY_PUNCH_MULTIPLIER = (MAX_PUNCH_SIZE - MIN_PUNCH_SIZE) / maxMatchesDay;
  var weekdayOptionData = weekdayData.map((matchGroup) => [0, parseInt(matchGroup.day) + 1, matchGroup.total, matchGroup.winrate, DAY_PUNCH_MULTIPLIER])

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
            return `winrate of ${(params.value[3] * 100).toFixed(2)}% in ${params.value[2]} matches`
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
            return val[2] * val[4] + MIN_PUNCH_SIZE;
        },
        data: data.concat(hourOptionData, weekdayOptionData),
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
    weekdayHourData: getUnsortedRecordByWeekdayThenHourArray(state),
    weekdayData: getUnsortedRecordByDayArray(state).filter(group => group.total > 0),
    hourData: getUnsortedRecordByHourArray(state).filter(group => group.total > 0)
  };
}

export default connect(mapStateToProps)(MatchesPunchcard)