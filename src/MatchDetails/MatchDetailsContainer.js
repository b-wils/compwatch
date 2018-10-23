import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import {getMathcesSortedByRecent} from '../redux/selectors'
// import MatchHistoryPresentation from './MatchHistoryPresentation'

class MatchHistoryContainer extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    return (<div>Match Details</div>)
  }

}

const mapStateToProps = (state, ownProps = {}) => {
  return {
    auth: state.firebase.auth,
    matches: getMathcesSortedByRecent(state)
  };
}

export default compose(
  firebaseConnect(), // withFirebase can also be used
  connect(mapStateToProps)
)(MatchHistoryContainer)