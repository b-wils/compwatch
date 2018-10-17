import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import styled, {css} from 'styled-components';

import Header from './Header'
import LeftNav from './LeftNavContainer'

const AppRoute = ({ component: Component, auth, firebase, ...rest }) => {
	return (
		<div>
		  <Header />
		  <LeftNav />
		  <Content>
			  <Route {...rest} render={(props) => (
			        !isLoaded(auth)
			        ? <span>Loading...</span>
			        : isEmpty(auth)
			          ? <span>Please <Link to="/login">login</Link> to continue</span>
			          : <div>
			          		<Component {...props} />
			          		<button onClick={() => firebase.logout({ provider: 'google', type: 'popup' })}> Logout </button>
			          	</div>
			  )}/>

		  </Content>
		</div>
	)
}

const Content = styled.div `
	padding: 32px;
`
export default compose(
  firebaseConnect(), // withFirebase can also be used
  connect(({ firebase: { auth } }) => ({ auth }))
)(AppRoute)
