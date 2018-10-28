import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Table} from 'antd'

import {getMatchesGroupedByMap, getRecordByMap, getSortedRecordByMap} from '../redux/selectors'

const columns = [{
  title: 'Map',
  dataIndex: 'map',
  key: 'map'
}, {
  title: 'Winrate',
  dataIndex: 'winrate'
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
    winrateByMap: getRecordByMap(state),
    sortedRecordByMap: getSortedRecordByMap(state)
  };
}

export default connect(mapStateToProps)(DashboardContainer)