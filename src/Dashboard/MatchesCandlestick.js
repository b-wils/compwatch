import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react';

import {getUnsortedRecordByDateArray} from '../redux/selectors'

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

const MatchesCandlestick = ({dateData}) => {

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

const mapStateToProps = (state) => {
  return {
    dateData: getUnsortedRecordByDateArray(state),
  };
}

export default connect(mapStateToProps)(MatchesCandlestick)