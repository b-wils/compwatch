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

class MatchEntryContainer2 extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      newSR: "",
      selectedHeroes: {},
      selectedMap: null,
      message: "",
      currentSR: this.props.lastSR
    }

  }

  render() {
    return(<MatchDisplayContainer onChange={this.handleMatchChange} match={this.state} handleSubmit={this.handleSubmit}/>);
  }

  handleSubmit = (event) => {

    event.preventDefault();

    var firestore = this.context.store.firestore
    var {selectedHeroes, selectedMap, newSR, currentSR, result} = this.state;

    var newMatch = {
      heroes: Object.keys(selectedHeroes).filter((key) => {return selectedHeroes[key] !== false;  }),
      map: selectedMap,
      lastSR: this.props.lastSR,
      currentSR: currentSR,
      newSR: newSR,
      isCurrentSRChanged: (this.props.lastSR !== currentSR),
      userId: this.props.auth.uid,
      firebaseTime: firestore.FieldValue.serverTimestamp(),
      localTime: new Date(),
      result: result,
      season: this.props.season
    }

    firestore.add({collection: 'matches'}, newMatch)

    this.setState({
      newSR: "",
      selectedHeroes: {},
      selectedMap: null,
      message: "Match submitted",
      currentSR: newSR,
      result: '',
      SRDiff: null
    })

  }

  handleMatchChange = (match) => {
    console.log(match)
    console.log(this.state)
    this.setState(match);
  }

}


const mapStateToProps = (state, ownProps = {}) => {
  return {
    auth: state.firebase.auth,
    sortedHeroes: sortedHeroesSelector(state),
    sortedMaps: sortedMapsSelector(state),
    season: currentSeasonSelector(state),
    lastSR: getCurrentSRSelector(state)
  };
}

MatchEntryContainer2.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps)
)(MatchEntryContainer2)