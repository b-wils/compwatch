import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react';

import {getUnsortedRecordByMapArray, getRecordByMapTypesObject} from '../redux/selectors'

const MapBarGraph = ({mapData, mapTypeData}) => {

  var mapGraphData = mapData.map((map)=>[map.type, map.winrate, map])

  const DEFAULT_MAP_COLOR = "#145214"

  var mapTypeGraphData = Object.keys(mapTypeData).map((mapType) => [mapType, ...mapTypeData[mapType].map((map)=>map.winrate)])

  // Find the type with most number of maps, -1 for the type text
  const NUM_ENTRIES_PER_TYPE = Math.max(...mapTypeGraphData.map((a)=>a.length)) - 1;

  let seriesData = [];

  for (let i = 0; i < NUM_ENTRIES_PER_TYPE; i++ ) {
    seriesData.push({
        type: 'bar',
        itemStyle: {
            normal: {
                color: function (param) {
                    let origEntry = mapTypeData[param.name][param.componentIndex]
                    
                    if (!origEntry) {
                      return DEFAULT_MAP_COLOR
                    } else {

                      return origEntry.color || DEFAULT_MAP_COLOR;
                    }
                }
            }
        }
    })
  }

  var option = {
    dataset: {
      source: mapTypeGraphData
    },
    xAxis: {
      type: 'category'
  },
    yAxis: {name: 'winrate'},
    series: seriesData,
    tooltip: {
      position: 'top',
      formatter: function (params) {
          let origEntry = mapTypeData[params.name][params.componentIndex]
          return `${origEntry.name} winrate of ${(origEntry.winrate * 100).toFixed(2)}% in ${origEntry.total} games`;
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
    mapTypeData: getRecordByMapTypesObject(state)
  };
}

export default connect(mapStateToProps)(MapBarGraph)