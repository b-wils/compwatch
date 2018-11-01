import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Table} from 'antd'

import {getMatchesGroupedByMap, getRecordByMapObject, getSortedRecordByMapArray} from '../redux/selectors'

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

const DashboardContainer = ({sortedRecordByMap}) => {
  return (
      <div> <Table dataSource={sortedRecordByMap} columns={columns} size='small' pagination={false}/>
      </div>
    )
}


const mapStateToProps = (state) => {
  return {
    matchesByMap: getMatchesGroupedByMap(state),
    winrateByMap: getRecordByMapObject(state),
    sortedRecordByMap: getSortedRecordByMapArray(state)
  };
}

export default connect(mapStateToProps)(DashboardContainer)