import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import {sortedMapsSelector, sortedHeroesSelector, currentSeasonSelector, getCurrentSRSelector} from '../redux/selectors'
import MatchDisplayContainer from './MatchDisplayContainer'

class MatchEntryContainer2 extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      match: {
        newSR: "",
        selectedHeroes: {},
        selectedMap: null,
        currentSR: this.props.lastSR,
        placementMatch: this.props.lastSR ? false : true
      },
      message: ''
    }

  }

  render() {
    return(<form onSubmit={this.handleSubmit}>
            {this.state.message ? <div> {this.state.message}</div> : null}
            <MatchDisplayContainer onChange={this.handleMatchChange} match={this.state.match}/>
             <div style={{width: '100%'}}><input type="submit" value="Submit" /></div> 
           </form>);
  }

  handleSubmit = (event) => {

    event.preventDefault();

    var firestore = this.context.store.firestore
    var {selectedHeroes, selectedMap, newSR, currentSR, result, placementMatch} = this.state.match;

    var newMatch = {
      heroes: Object.keys(selectedHeroes).filter((key) => {return selectedHeroes[key] !== false;  }),
      map: selectedMap,
      lastSR: this.props.lastSR,
      currentSR: currentSR,
      newSR: newSR || null,
      isCurrentSRChanged: (this.props.lastSR !== currentSR),
      userId: this.props.auth.uid,
      firebaseTime: firestore.FieldValue.serverTimestamp(),
      localTime: new Date(),
      result: result,
      season: this.props.season,
      placementMatch: placementMatch
    }

    firestore.add({collection: 'matches'}, newMatch)

    this.setState({
      match: {
        newSR: null,
        lastSR: newSR,
        selectedHeroes: {},
        selectedMap: null,
        currentSR: newSR || null,
        result: '',
        SRDiff: null,
        placementMatch: newSR ? false : true
      },
      message: "Match submitted"
    })

  }

  handleMatchChange = (match) => {
    this.setState({match:match, message: ""});
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