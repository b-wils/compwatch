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
        <CandlestickChart dateData={dateData} />
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


function splitData(rawData) {
    var categoryData = [];
    var values = []
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i])
    }
    return {
        categoryData: categoryData,
        values: values
    };
}

const CandlestickChart = ({dateData}) => {

var downColor = '#ec0000';
var downBorderColor = '#8A0000';
var upColor = '#00da3c';
var upBorderColor = '#008F28';

  var matchGraphData = dateData.filter((dateEntry)=>(dateEntry.startSR)).map((dateEntry)=>[dateEntry.date, dateEntry.startSR, dateEntry.endSR, dateEntry.minSR, dateEntry.maxSR]).reverse();

  var data0 = splitData(matchGraphData)

var option = {
    title: {
        text: '上证指数',
        left: 0
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    legend: {
        data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
    },
    xAxis: {
        type: 'category',
        data: data0.categoryData,
        scale: true,
        boundaryGap : false,
        axisLine: {onZero: false},
        splitLine: {show: false},
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax'
    },
    yAxis: {
        scale: true,
        splitArea: {
            show: true
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100
        },
        {
            show: true,
            type: 'slider',
            y: '90%',
            start: 0 ,
            end: 100
        }
    ],
    series: [
        {
            name: '日K',
            type: 'candlestick',
            data: data0.values,
            itemStyle: {
                normal: {
                    color: upColor,
                    color0: downColor,
                    borderColor: upBorderColor,
                    borderColor0: downBorderColor
                }
            }
        }
    ]
};

  return (
      <ReactEcharts option={option} />
    )
}


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
            return params.value[2] + ' commits in ' + hoursLabels[params.value[0]] + ' of ' + daysLabels[params.value[1]];
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