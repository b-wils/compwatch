import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Table} from 'antd'
import ReactEcharts from 'echarts-for-react';

import {getMatchesGroupedByMap, getRecordByMapObject, getSortedRecordByMapArray, getRatedMatches} from '../redux/selectors'

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

const DashboardContainer = ({sortedRecordByMap, matches}) => {

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

  var option = {
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
      <div> 
        <ReactEcharts option={option} />
        <Table dataSource={sortedRecordByMap} columns={columns} size='small' pagination={false}/>
      </div>
    )
}


const mapStateToProps = (state) => {
  return {
    matchesByMap: getMatchesGroupedByMap(state),
    winrateByMap: getRecordByMapObject(state),
    sortedRecordByMap: getSortedRecordByMapArray(state),
    matches: getRatedMatches(state)
  };
}

export default connect(mapStateToProps)(DashboardContainer)