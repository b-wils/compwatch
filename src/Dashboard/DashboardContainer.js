import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Table} from 'antd'
import ReactEcharts from 'echarts-for-react';

import format from 'date-fns/format'
import setDay from 'date-fns/set_day'
import setHours from 'date-fns/set_hours'

import {getSortedRecordByMapArray, getRatedMatches, getSortedRecordByHeroArray, getUnsortedRecordByDateArray, getUnsortedRecordByWeekdayThenHourArray} from '../redux/selectors'

const columns = [{
  title: 'Map',
  dataIndex: 'map',
  key: 'map'
}, {
  title: 'Winrate',
  dataIndex: 'winrate',
  render: (val) => (val ? (val *100).toFixed(2) + '%' : 'No Data')
},
{
  title: 'Map Type',
  dataIndex: 'type'
}];

const DashboardContainer = ({sortedRecordByMap, matches, heroData, dateData, dayTimeData, weekdayHourData}) => {

  var totalMatches = matches.length;

  var heroGraphData = heroData.map((hero)=>[hero.total/totalMatches, hero.winrate, hero.name])

  var heroOption = {
    xAxis: {
      name:"Play Amount",
      nameLocation: "middle"
    },
    yAxis: {
      name:"Winrate",
      nameLocation: "middle"
    },
    series: [{
        symbolSize: 20,
        data: heroGraphData,
        type: 'scatter'
    }],
    tooltip: {
      position: 'top',
      formatter: function (params) {
          return `${params.value[2]} winrate of ${(params.value[1] * 100).toFixed(2)}% in ${(params.value[0] * 100).toFixed(2)}% of games`;
      }
    }
  }


  var dateGraphData = dateData.map((date)=>[date.key, date.total])

  var dateOption = {
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
      <div> 
        <MatchChart matches={matches} />
        <PunchCard weekdayHourData={weekdayHourData} />
        <ReactEcharts option={heroOption} />
        <ReactEcharts option={dateOption} />
        <Table dataSource={sortedRecordByMap} columns={columns} size='small' pagination={false}/>
      </div>
    )
}

const MatchChart = ({matches}) => {
//  Linear time axis, looks a bit off
//   var matchGraphData = matches.map((match)=>[match.localTime.toDate(),match.newSR])

//   var option = {
//     xAxis: {
//         type: 'time'
//     },
//     yAxis: {
//         type: 'value',
//         min: 'dataMin',
//         max: 'dataMax'
//     },
//     series: [{
//         data: matchGraphData,
//         type: 'line'
//     }]
// };

  var matchGraphData = matches.map((match)=>match.newSR)

  var matchOption = {
    xAxis: {
        type: 'category'
    },
    yAxis: {
        type: 'value',
        min: 'dataMin',
        max: 'dataMax'
    },
    series: [{
        data: matchGraphData,
        type: 'line'
    }]
};


  return (
      <ReactEcharts option={matchOption} />
    )
}


var hoursLabels = [];

var now = new Date();

for (let i = 0; i<24;i++) {
  hoursLabels.push(format(setHours(now,i),'h a'))
}

console.log(hoursLabels)

var days = ['Saturday', 'Friday', 'Thursday',
        'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

const PunchCard = ({weekdayHourData}) => {



  var data = weekdayHourData.map((matchGroup)=>[ parseInt(matchGroup.hour), parseInt(matchGroup.weekday), matchGroup.total])

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
            return params.value[2] + ' commits in ' + hoursLabels[params.value[0]] + ' of ' + days[params.value[1]];
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
        data: days,
        axisLine: {
            show: false
        }
    },
    series: [{
        name: 'Punch Card',
        type: 'scatter',
        symbolSize: function (val) {
            return val[2] * 4;
        },
        data: data,
        animationDelay: function (idx) {
            return idx * 5;
        }
    }]
};


  return (
      <ReactEcharts option={option} />
    )
}

const mapStateToProps = (state) => {
  return {
    sortedRecordByMap: getSortedRecordByMapArray(state),
    matches: getRatedMatches(state),
    heroData: getSortedRecordByHeroArray(state).filter(hero => hero.total > 0),
    dateData: getUnsortedRecordByDateArray(state),
    weekdayHourData: getUnsortedRecordByWeekdayThenHourArray(state)
  };
}

export default connect(mapStateToProps)(DashboardContainer)