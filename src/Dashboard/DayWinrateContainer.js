import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Table} from 'antd'
import format from 'date-fns/format'
import setDay from 'date-fns/set_day'
import setHours from 'date-fns/set_hours'

import {getUnsortedRecordByDayArray, getUnsortedRecordByHourArray} from '../redux/selectors'



const columns = [{
  title: 'Day',
  dataIndex: 'day',
  render: (val) => (format(setDay(new Date(), val), 'dddd'))
}, {
  title: 'Winrate',
  dataIndex: 'winrate',
  render: (val) => (val ? (val *100).toFixed(2) + '%' : 'No Data')
}];

const hourColumns = [{
  title: 'Hour',
  dataIndex: 'hour',
  render: (val) => (format(setHours(new Date(), val), 'HH'))
}, {
  title: 'Winrate',
  dataIndex: 'winrate',
  render: (val) => (val ? (val *100).toFixed(2) + '%' : 'No Data')
}];

const DashboardContainer = ({sortedRecordByDay, sortedRecordByHour}) => {
  return (
      <div>
        <Table dataSource={sortedRecordByDay} columns={columns} size='small' pagination={false}/>
        <Table dataSource={sortedRecordByHour} columns={hourColumns} size='small' pagination={false}/>
      </div>
    )
}


const mapStateToProps = (state) => {
  return {
    sortedRecordByDay: getUnsortedRecordByDayArray(state),
    sortedRecordByHour: getUnsortedRecordByHourArray(state),
  };
}

export default connect(mapStateToProps)(DashboardContainer)