import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import { withFirebase } from 'react-redux-firebase'
import {sortedMapsSelector, sortedHeroesSelector, currentSeasonSelector} from './redux/selectors'

import logo from './logo.svg';
import './App.css';
import MatchEntry from './MatchEntry'


class App extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  // Don't load any data until firebase auth is loaded. We will need the userid for certain queries
  // TODO Not all queries or pages need userid so we should make a better way to do this

  render() {
    return (
      <div className="App">
          {!isEmpty(this.props.auth) ?
           <MatchEntry /> :
           <button onClick={() => this.props.firebase.login({ provider: 'google', type: 'popup' })}>
             Login With Google</button> }
      </div>
    );

  }

}

const mapStateToProps = (state, ownProps = {}) => {
  return {
    auth: state.firebase.auth,
  };
}

App.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps)
)(App)