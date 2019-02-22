import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react';

import {getSortedRecordByHeroArray, getMathcesSortedByRecent} from '../redux/selectors'

const HeroScatter = ({totalMatches, heroData}) => {

  var heroGraphData = heroData.map((hero)=>[hero.total, hero.winrate * 100, hero.name])

  const DEFAULT_HERO_COLOR = "#000000"

  var option = {
    title: {
      text: 'Hero Winrates'
    },
    xAxis: {
      name:"Games Played",
      nameLocation: "middle",
      type: "value",
      min: 0,
    },
    yAxis: {
      name:"Winrate",
      min: 0,
      max: 100,
      interval: 25,
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
          return `${params.value[2]} winrate of ${(params.value[1]).toFixed(2)}% in ${(params.value[0])} games`;
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