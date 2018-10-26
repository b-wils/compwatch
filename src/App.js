import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import styled from 'styled-components/macro';
import {css, ThemeProvider} from 'styled-components'

import AppRoute from './common/AppRoute'
// import './App.css';
import MatchEntry from './MatchEntry/MatchEntryContainer'
import MatchHistory from './MatchHistory/MatchHistoryContainer'
import MatchDetails from './MatchDetails/MatchDetailsContainer'

class App extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render() {
    return (
      <ThemeProvider theme={monochromaticTheme}>
        <MasterDiv>
          {process.env.NODE_ENV === 'development' && process.env.REACT_APP_HIDE_DEV_WARNING !== 'true' && <DevWarningDiv position="top"/>}
          
          <Router>
            <Switch>
              
              <AppRoute path="/addmatch" component={MatchEntry} />
              <AppRoute exact path="/matches" component={MatchHistory} />
              <AppRoute path="/matches/:matchId" component={MatchDetails} />

              <Route path="/login" component={WrappedLoginPage}/>
              <Route exact path="/" component={WelcomePage}/>
            </Switch>
          </Router>

          {process.env.NODE_ENV === 'development' && process.env.REACT_APP_HIDE_DEV_WARNING !== 'true' && <DevWarningDiv position="bottom"/>}
        </MasterDiv>
      </ThemeProvider>
    );

  }

}

const WelcomePage = () => {
  return (
      <div style={{margin:'30px'}}>
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
          ? <div style={{margin:'30px'}}>
              <button onClick={() => firebase.login({ provider: 'google', type: 'popup' })}>
                Login With Google
              </button>
            </div>
          : <Redirect to="/addmatch"/>
  )

const WrappedLoginPage = compose(firebaseConnect(), connect(({ firebase: { auth } }) => ({ auth })))(LoginPage);

const DevWarningDiv = ({position}) => {
  var style = {color: 'white', backgroundColor: 'red', position: 'fixed', width:'100%', zIndex:100}
  switch (position) {
    case 'top':
      style.top = '0px'
      break;
    case 'bottom':
      style.bottom = '0px'
      break;
    default:
      console.log('warning dev div with no position')
  }
  return <div style={style}>DEVELOPMENT BUILD</div>
}

const MasterDiv = styled.div `

`

const monochromaticTheme = {
  primary: '#333333',
  secondary: '#666666',
  light: '#ffffff',
  mid: '#999999',
  dark: '#000000'
}

// http://paletton.com/#uid=23P0u0kmlhN53nGdZkFwaeqS1cp
const blueOrangeTheme = {
  primary: '#09254E',
  secondary: '#CE8C17',
  light: '#ffffff',
  mid: '#999999',
  dark: '#000000'
}

App.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
}

export default App