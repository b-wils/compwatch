import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty } from 'react-redux-firebase'

import './App.css';
import MatchEntry from './MatchEntry/MatchEntryContainer'


class App extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  // Don't load any data until firebase auth is loaded. We will need the userid for certain queries
  // TODO Not all queries or pages need userid so we should make a better way to do this

  render() {
    return (
      <div className="App">
          {process.env.NODE_ENV === 'development' && <DevWarningDiv/>}
          {!isEmpty(this.props.auth) ?
            <div>
              <MatchEntry /> 
              <button onClick={() => this.props.firebase.logout({ provider: 'google', type: 'popup' })}> Logout </button>
            </div>
            :
            <button onClick={() => this.props.firebase.login({ provider: 'google', type: 'popup' })}>
             Login With Google</button> }
          {process.env.NODE_ENV === 'development' && <DevWarningDiv/>}
      </div>
    );

  }

}

const DevWarningDiv = () => {
  return <div style={{color: 'white', backgroundColor: 'red'}}>DEVELOPMENT BUILD</div>
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