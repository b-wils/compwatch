import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import {sortedMapsSelector, sortedHeroesSelector, currentSeasonSelector, getCurrentSRSelector} from '../redux/selectors'
import MatchDisplayContainer from './MatchDisplayContainer'


const DEFAULT_SR_CHANGE = 25;
// const MINIMUM_SR_UPDATE = 500;
// const MAXIMUM_SR_UPDATE = 6000;
const MAXIMUM_SR_DIFFERENCE_UPDATE = 200;

class MatchDetailsContainer extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    var selectedHeroes = props.originalMatch.heroes.reduce(function(acc, cur, i) {
      acc[cur] = true;
      return acc;
    }, {});

    let {heroes,map, ...currentMatch} = props.originalMatch


    currentMatch.selectedHeroes = selectedHeroes;
    currentMatch.selectedMap = props.originalMatch.map;

    this.state = {
      currentMatch: currentMatch,
      message: ""
    }

  }

  render() {
    return(<MatchDisplayContainer onChange={this.handleMatchChange} match={this.state.currentMatch} handleSubmit={this.handleSubmit}/>);
  }

  handleSubmit = (event) => {

// console.log(this.state.currentMatch)

    event.preventDefault();

    var firestore = this.context.store.firestore

    let {selectedHeroes, selectedMap, ...matchUpdate} = this.state.currentMatch;

    

    matchUpdate.heroes = Object.keys(selectedHeroes).filter((key) => {return selectedHeroes[key] !== false;  });
    matchUpdate.map = selectedMap;

    firestore.update({collection: 'matches', doc:this.props.matchId}, matchUpdate)

  }

  handleMatchChange = (match) => {
    this.setState({currentMatch: match});
  }

}


const mapStateToProps = (state, ownProps) => {
  return {
    sortedHeroes: sortedHeroesSelector(state),
    sortedMaps: sortedMapsSelector(state),
    season: currentSeasonSelector(state),
    originalMatch: state.firestore.data.matches[ownProps.match.params.matchId],
    matchId: ownProps.match.params.matchId
  };
}

MatchDetailsContainer.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps)
)(MatchDetailsContainer)