import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import {sortedMapsSelector, sortedHeroesSelector, currentSeasonSelector} from '../redux/selectors'
import MatchDisplayContainer from './MatchDisplayContainer'

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
    return(<form onSubmit={this.handleSubmit}>
            {this.state.message ? <div> {this.state.message}</div> : null}
            <MatchDisplayContainer onChange={this.handleMatchChange} match={this.state.currentMatch}/>
             <div style={{width: '100%'}}><input type="submit" value="Submit" /></div> 
           </form>);
  }

  handleSubmit = (event) => {

    event.preventDefault();

    var firestore = this.context.store.firestore

    let {selectedHeroes, selectedMap, ...matchUpdate} = this.state.currentMatch;

    matchUpdate.heroes = Object.keys(selectedHeroes).filter((key) => {return selectedHeroes[key] !== false;  });
    matchUpdate.map = selectedMap;

    firestore.update({collection: 'matches', doc:this.props.matchId}, matchUpdate)

    this.setState({message:'Match Submitted'})

  }

  handleMatchChange = (match) => {
    this.setState({currentMatch: match, message: ""} );
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