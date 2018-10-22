import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { firebaseConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import styled, {css} from 'styled-components';
import { Layout, Menu } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const Item = {Menu}

// import Header from './Header'
// import LeftNav from './LeftNavContainer'

// TODO we should probably split the auth layout from 

const AppRoute = ({ component: Component, auth, firebase, ...rest }) => {
	return (
		<Layout>
		  	<Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }} >
		  		<Menu theme='dark'>
		  		
		  			<Menu.Item>
		  				<Link to='addmatch'>Add Match</Link>
		  			</Menu.Item>
		  			<Menu.Item>
		  				<Link to='matches'>Match History</Link>
		  			</Menu.Item>
		  			<Menu.Item>
		  				<Link to='dashboard'>Dashboard</Link>
		  			</Menu.Item>
		  			<Menu.Item onClick={() => firebase.logout()}>
		  				Logout
		  			</Menu.Item>
		  		</Menu>
		  	</Sider>
		  	<Layout style={{ marginLeft: 200 }}>
			  	<Header style={{ background: '#fff', padding: 0 }}>
			  		Overlogger
			  	</Header>
	 			<Content>
				  <Route {...rest} render={(props) => (
				        !isLoaded(auth)
				        ? <span>Loading...</span>
				        : isEmpty(auth)
				          ? <span>Please <Link to="/login">login</Link> to continue</span>
				          : <div>
				          		<Component {...props} />
				          	</div>
				  )}/>

			  	</Content> 
		  	</Layout>
		</Layout>
	)
}

// const Content = styled.div `
// 	padding: 32px;
// `

export default compose(
  firebaseConnect(), // withFirebase can also be used
  connect(({ firebase: { auth } }) => ({ auth }))
)(AppRoute)
