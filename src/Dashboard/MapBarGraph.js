import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react';

import {getUnsortedRecordByMapArray, getRecordByMapTypesObject} from '../redux/selectors'

const MapBarGraph = ({mapData}) => {

  var mapGraphData = mapData.map((map)=>[map.name, map.winrate, map.total])

  const DEFAULT_MAP_COLOR = "#000000"

  var option = {
    dataset: {
      source: [["map", "winrate"], ...mapGraphData]
    },
    xAxis: {type: 'category'},
    yAxis: {name: 'winrate'},
    series: [{
        type: 'bar',
        itemStyle: {
            normal: {
                color: function (param) {
                    return mapData[param.dataIndex].color || DEFAULT_MAP_COLOR;
                }
            }
        }
    }],
    tooltip: {
      position: 'top',
      formatter: function (params) {
          return `${params.value[0]} winrate of ${(params.value[1] * 100).toFixed(2)}% in ${params.value[2]} games`;
      }
    }
  }

  return (
      <ReactEcharts option={option} />
    )
}

const mapStateToProps = (state) => {
  return {
    mapData: getUnsortedRecordByMapArray(state),
    mapTypesData: getRecordByMapTypesObject(state)
  };
}

export default connect(mapStateToProps)(MapBarGraph)