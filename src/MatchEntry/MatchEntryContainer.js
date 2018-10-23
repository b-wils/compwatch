import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import {sortedMapsSelector, sortedHeroesSelector, currentSeasonSelector, getCurrentSRSelector} from '../redux/selectors'
import MatchEntryPresentation from './MatchEntryPresentation'

const DEFAULT_SR_CHANGE = 25;
// const MINIMUM_SR_UPDATE = 500;
// const MAXIMUM_SR_UPDATE = 6000;
const MAXIMUM_SR_DIFFERENCE_UPDATE = 200;

class MatchEntryContainer extends Component {
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
      currentSR: 0
    }
    this.heroSelectChange = this.heroSelectChange.bind(this);
    this.mapSelectChange = this.mapSelectChange.bind(this);
    this.newSRChange = this.newSRChange.bind(this);
    this.currentSRChange = this.currentSRChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resultSelectChange = this.resultSelectChange.bind(this);
  }

  render() {
    var props = {
      ...this.props,
      ...this.state,
      newSRChange: this.newSRChange,
      currentSRChange: this.currentSRChange,
      heroSelectChange: this.heroSelectChange,
      mapSelectChange: this.mapSelectChange,
      handleSubmit: this.handleSubmit,
      resultSelectChange: this.resultSelectChange
    }

    // console.log(props)

    return (<MatchEntryPresentation {...props}/>)
  }


  newSRChange(value) {
    this.setState({
      newSR: value,
      message: ""
    }, () => this.updateResults())
  }

  currentSRChange(value) {
    this.setState({
      currentSR: value,
      message: ""
    }, () => this.updateResults())
  }

  resultSelectChange(event) {

    var {currentSR} = this.state;

    const target = event.target;
    const name = target.name.toLowerCase();

    switch (name) {
      case 'win':
        this.setState({
          result: 'win',
          SRDiff: DEFAULT_SR_CHANGE,
          newSR: currentSR + DEFAULT_SR_CHANGE
        })
        break;
      case 'draw':
        this.setState({
          result: 'draw',
          SRDiff: 0,
          newSR: currentSR
        })
        break;
      case 'loss':
        this.setState({
          result: 'loss',
          SRDiff: -DEFAULT_SR_CHANGE,
          newSR: currentSR - DEFAULT_SR_CHANGE
        })
        break;
      default:
        console.log('warning unknown result')
        break;
    }
  }

  updateResults() {

    console.log('update results')

    var {newSR, currentSR} = this.state;

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

    this.setState({
      SRDiff: SRDiff,
      result: result
    })
  }

  heroSelectChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    var newSelectedHeroes = this.state.selectedHeroes;

    newSelectedHeroes[name] = value

    this.setState({
      selectedHeroes: newSelectedHeroes,
      message: ""
    });

  }

  mapSelectChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      selectedMap: name,
      message: ""
    });
  }

  handleSubmit(event) {

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

  componentDidMount() {
    const { firestore } = this.context.store;
    const userId = this.props.auth.uid;

    firestore.get('heroes');
    firestore.get('maps');
    firestore.get('globals');
    firestore.get({collection: 'matches', where: ['userId', '==', userId], orderBy: ['firebaseTime', 'desc']})
        .then(()=>{
          this.setState({currentSR: this.props.lastSR})
        });


    firestore.setListener({ collection: 'matches', where: ['userId', '==', userId], orderBy: ['firebaseTime', 'desc'] })
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