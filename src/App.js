import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty } from 'react-redux-firebase'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import AppRoute from './common/AppRoute'
import './App.css';
import MatchEntry from './MatchEntry/MatchEntryContainer'


class App extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    return (
      <Router>
        <div className="App">
          {process.env.NODE_ENV === 'development' && <DevWarningDiv/>}
          <Route exact path="/" component={WelcomePage}/>
          <Route exact path="/login" component={WrappedLoginPage}/>
          <AppRoute exact path="/addmatch" component={MatchEntry} />
          {process.env.NODE_ENV === 'development' && <DevWarningDiv/>}
        </div>
      </Router>
    );

  }

}

const WelcomePage = () => {
  return (
      <div>
        Welcome to Overlogger!
        <Link to="/login"> Login </Link>
      </div>
    )
}

const LoginPage = ({firebase,auth}) => {
  return (
      <div>
        <button onClick={() => firebase.login({ provider: 'google', type: 'popup' })}>
          Login With Google
        </button>
      </div>
    )
}

const WrappedLoginPage = compose(firebaseConnect())(LoginPage, connect(mapStateToProps));

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

export default App