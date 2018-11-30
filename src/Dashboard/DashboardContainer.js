import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Table} from 'antd'
import ReactEcharts from 'echarts-for-react';

import {getSortedRecordByMapArray, getRatedMatches, getSortedRecordByHeroArray} from '../redux/selectors'

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

const DashboardContainer = ({sortedRecordByMap, matches, heroData}) => {

//  Variable time axis, looks a bit off
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

  return (
      <div> 
        <ReactEcharts option={matchOption} />
        <ReactEcharts option={heroOption} />
        <Table dataSource={sortedRecordByMap} columns={columns} size='small' pagination={false}/>
      </div>
    )
}


const mapStateToProps = (state) => {
  return {
    sortedRecordByMap: getSortedRecordByMapArray(state),
    matches: getRatedMatches(state),
    heroData: getSortedRecordByHeroArray(state).filter(hero => hero.total > 0)
  };
}

export default connect(mapStateToProps)(DashboardContainer)