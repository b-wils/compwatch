import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Table} from 'antd'

import {getMatchesGroupedByHero, getRecordByHeroObject, getSortedRecordByHeroArray} from '../redux/selectors'

const columns = [{
  title: 'Hero',
  dataIndex: 'hero',
  key: 'hero'
}, {
  title: 'Winrate',
  dataIndex: 'winrate'
},
{
  title: 'Hero Role',
  dataIndex: 'role'
}];

const HeroWinrateContainer = ({sortedRecordByHero}) => {
  return (
      <div> <Table dataSource={sortedRecordByHero} columns={columns} size='small' pagination={false}/>
      </div>
    )
}


const mapStateToProps = (state) => {
  return {
    matchesByHero: getMatchesGroupedByHero(state),
    winrateByHero: getRecordByHeroObject(state),
    sortedRecordByHero: getSortedRecordByHeroArray(state)
  };
}

export default connect(mapStateToProps)(HeroWinrateContainer)