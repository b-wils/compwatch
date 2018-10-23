import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import {getMathcesSortedByRecent} from '../redux/selectors'
import MatchHistoryPresentation from './MatchHistoryPresentation'

class MatchHistoryContainer extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    return (<MatchHistoryPresentation matches={this.props.matches}/>)
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
    matches: getMathcesSortedByRecent(state)
  };
}

MatchHistoryContainer.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
}


export default compose(
  firebaseConnect(), // withFirebase can also be used
  connect(mapStateToProps)
)(MatchHistoryContainer)