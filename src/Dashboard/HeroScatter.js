import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react';

import {getSortedRecordByHeroArray, getMathcesSortedByRecent} from '../redux/selectors'

const HeroScatter = ({totalMatches, heroData}) => {

  var heroGraphData = heroData.map((hero)=>[hero.total/totalMatches, hero.winrate, hero.name])

  const DEFAULT_HERO_COLOR = "#000000"

  var option = {
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
        type: 'scatter',
        itemStyle: {
            normal: {
                color: function (param) {
                    return heroData[param.dataIndex].color || DEFAULT_HERO_COLOR;
                }
            }
        }
    }],
    tooltip: {
      position: 'top',
      formatter: function (params) {
          return `${params.value[2]} winrate of ${(params.value[1] * 100).toFixed(2)}% in ${(params.value[0] * 100).toFixed(2)}% of games`;
      }
    }
  }

  return (
      <ReactEcharts option={option} />
    )
}

const mapStateToProps = (state) => {
  return {
    heroData: getSortedRecordByHeroArray(state).filter(hero => hero.total > 0),
    totalMatches: getMathcesSortedByRecent(state).length
  };
}

export default connect(mapStateToProps)(HeroScatter)