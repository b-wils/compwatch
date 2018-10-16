import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase'

const AppRoute = ({ component: Component, auth, firebase, ...rest }) => (
  <Route {...rest} render={(props) => (
        !isLoaded(auth)
        ? <span>Loading...</span>
        : isEmpty(auth)
          ? <span>Please <Link to="/login">login</Link> to continue</span>
          : <div>
          		<Component {...props} />
          		<button onClick={() => firebase.logout({ provider: 'google', type: 'popup' })}> Logout </button>
          	</div>
  )} />
)

export default compose(
  firebaseConnect(), // withFirebase can also be used
  connect(({ firebase: { auth } }) => ({ auth }))
)(AppRoute)