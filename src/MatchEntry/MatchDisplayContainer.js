import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import clone from 'lodash.clonedeep'

import {sortedMapsSelector, sortedHeroesSelector, currentSeasonSelector, getCurrentSRSelector} from '../redux/selectors'
import MatchDisplayPresentation from './MatchDisplayPresentation'

const DEFAULT_SR_CHANGE = 25;
// const MINIMUM_SR_UPDATE = 500;
// const MAXIMUM_SR_UPDATE = 6000;
const MAXIMUM_SR_DIFFERENCE_UPDATE = 200;

class MatchEntryContainer extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {

    var props = {
      ...this.props.match,
      sortedHeroes: this.props.sortedHeroes,
      sortedMaps: this.props.sortedMaps,
      newSRChange: this.newSRChange,
      currentSRChange: this.currentSRChange,
      heroSelectChange: this.heroSelectChange,
      mapSelectChange: this.mapSelectChange,
      resultSelectChange: this.resultSelectChange
    }

    return (<MatchDisplayPresentation {...props}/>)
  }


  newSRChange = (value) => {

    var localMatch = clone(this.props.match)

    Object.assign(localMatch, {
      newSR: value,
      message: ""
    });

    this.updateResults(localMatch)
  }

  currentSRChange = (value) => {
    var localMatch = clone(this.props.match)

    Object.assign(localMatch, {
      currentSR: value,
      message: ""
    });

    this.updateResults(localMatch)
  }

  resultSelectChange = (event) => {

    var {currentSR} = this.props.match;

    const target = event.target;
    const name = target.name.toLowerCase();

    var updates = {}

    switch (name) {
      case 'win':
        updates = {
          result: 'win',
          SRDiff: DEFAULT_SR_CHANGE,
          newSR: currentSR + DEFAULT_SR_CHANGE
        }
        break;
      case 'draw':
        updates = {
          result: 'draw',
          SRDiff: 0,
          newSR: currentSR
        }
        break;
      case 'loss':
        updates = {
          result: 'loss',
          SRDiff: -DEFAULT_SR_CHANGE,
          newSR: currentSR - DEFAULT_SR_CHANGE
        }
        break;
      default:
        console.log('warning unknown result')
        break;
    }

    var localMatch = clone(this.props.match)

    Object.assign(localMatch, updates);

    this.props.onChange(localMatch);
  }

  updateResults = (localMatch) => {

    var {newSR, currentSR} = localMatch;

    var SRDiff = newSR - currentSR;

    // Large SR changes typically mean the user is typing and we shouldn't update prematurely
    // Not sure if this is a good solution
    if (Math.abs(SRDiff) > MAXIMUM_SR_DIFFERENCE_UPDATE || newSR === undefined || currentSR === undefined) {
      return;
    }

    var result;

    if (currentSR === '' || newSR === '') {
      result = '';
      SRDiff = null;
    }

    if (newSR > currentSR) {
      result = 'win'
    } else if (newSR < currentSR) {
      result = 'loss'
    } else {
      result = 'draw'
    }

    Object.assign(localMatch, {
      SRDiff: SRDiff,
      result: result
    })

    this.props.onChange(localMatch);
  }

  heroSelectChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    var localMatch = clone(this.props.match)

    var newSelectedHeroes = localMatch.selectedHeroes;

    newSelectedHeroes[name] = value

    Object.assign(localMatch, {
      selectedHeroes: newSelectedHeroes,
      message: ""
    });
    this.props.onChange(localMatch);
  }

  mapSelectChange = (event) => {
    const target = event.target;
    const name = target.name;

    var localMatch = clone(this.props.match)

    Object.assign(localMatch, {
      selectedMap: name,
      message: ""
    });
    this.props.onChange(localMatch);
  }

}

const mapStateToProps = (state, ownProps = {}) => {
  return {
    sortedHeroes: sortedHeroesSelector(state),
    sortedMaps: sortedMapsSelector(state),
  };
}

MatchEntryContainer.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps)
)(MatchEntryContainer)