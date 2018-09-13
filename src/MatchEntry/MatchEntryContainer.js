import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import { withFirebase } from 'react-redux-firebase'
import {sortedMapsSelector, sortedHeroesSelector, currentSeasonSelector, getCurrentSRSelector} from '../redux/selectors'
import MatchEntryPresentation from './MatchEntryPresentation'

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
  }

  render() {
    var props = {
      ...this.props,
      ...this.state,
      newSRChange: this.newSRChange,
      currentSRChange: this.currentSRChange,
      heroSelectChange: this.heroSelectChange,
      mapSelectChange: this.mapSelectChange,
      handleSubmit: this.handleSubmit
    }

    // console.log(props)

    return (<MatchEntryPresentation {...props}/>)
  }


  newSRChange(event) {
    var newSR = event.target.value;
    
    if (newSR === '') {
      newSR = 0;
    }

    this.setState({
      newSR: parseInt(newSR),
      message: ""
    }, () => this.updateResults())

  }

  currentSRChange(event) {
    var currentSR = event.target.value;
    
    if (currentSR === '') {
      currentSR = 0;
    }

    this.setState({
      currentSR: parseInt(currentSR),
      message: ""
    }, ()=> this.updateResults())
  }

  updateResults() {

    var {newSR, currentSR} = this.state;

    currentSR = parseInt(currentSR, 10)
    newSR = parseInt(newSR, 10)
    var SRDiff = newSR - currentSR;

    var result;

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
    const value = target.type === 'checkbox' ? target.checked : target.value;
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
      isCurrentSRChanged: (this.props.lastSR != currentSR),
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
      currentSR: newSR
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