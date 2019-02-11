import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Table} from 'antd'
import ReactEcharts from 'echarts-for-react';

import MatchesCandlestick from './MatchesCandlestick'
import MatchesPunchcard from './MatchesPunchcard'
import HeroScatter from './HeroScatter'
import MatchHeatmap from './MatchHeatmap'

const DashboardContainer = () => {

  return (
      <div> 
        <MatchesPunchcard />
        <MatchesCandlestick />
        <HeroScatter/>
        <MatchHeatmap />
      </div>
    )
}

export default DashboardContainer