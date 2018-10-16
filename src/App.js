import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase'

import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";

import AppRoute from './common/AppRoute'
import './App.css';
import MatchEntry from './MatchEntry/MatchEntryContainer'


class App extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    return (
      <div className="App">
        {process.env.NODE_ENV === 'development' && <DevWarningDiv/>}
        
        <Router>
          <Switch>
            <Route exact path="/" component={WelcomePage}/>
            <Route path="/login" component={WrappedLoginPage}/>
            <AppRoute path="/addmatch" component={MatchEntry} />
          </Switch>
        </Router>
        
        {process.env.NODE_ENV === 'development' && <DevWarningDiv/>}
      </div>
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

// TODO Login page will always redirect if you are already logged in. Should we only redirect after successful login?
const LoginPage = ({firebase,auth}) => (
        !isLoaded(auth)
        ? <span>Loading...</span>
        : isEmpty(auth)
          ? <div>
              <button onClick={() => firebase.login({ provider: 'google', type: 'popup' })}>
                Login With Google
              </button>
            </div>
          : <Redirect to="/addmatch"/>
  )

const WrappedLoginPage = compose(firebaseConnect(), connect(({ firebase: { auth } }) => ({ auth })))(LoginPage);

const DevWarningDiv = () => {
  return <div style={{color: 'white', backgroundColor: 'red'}}>DEVELOPMENT BUILD</div>
}

const mapStateToProps = (state, ownProps = {}) => {
  console.log(state.firebase.auth)
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