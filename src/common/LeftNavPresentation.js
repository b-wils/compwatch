import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from 'styled-components/macro';
import {css} from 'styled-components';
import { firebaseConnect } from 'react-redux-firebase'

const NAV_WIDTH = '200px'

const LeftNav = ({sessionRecord, firebase}) => (
	<LeftNavBuffer>
		<LeftNavDiv>
			Session Record: {`${sessionRecord.wins} - ${sessionRecord.losses} - ${sessionRecord.draws}`}

				<NavLink to="/addmatch"> Add Match </NavLink>
				<NavLink to="/matches"> Match History </NavLink>
				<NavLink to="/statistics"> Statistics </NavLink>
				<NavLink as="button" onClick={() => firebase.logout()}> Logout </NavLink>

		</LeftNavDiv>
	</LeftNavBuffer>
)

const LeftNavDiv = styled.div `
	width: ${NAV_WIDTH};
	min-height: 100%;
	background-color: ${props => props.theme.primary};
	color: ${props => props.theme.light};
	position: fixed;
	padding: 10px;
`

// TODO need a good way for nav height to fill remaining space
const LeftNavBuffer  = styled.div `
	width: ${NAV_WIDTH};
	min-height: 80vh;
	float: left;
	position: relative;
`
//const NavLink = styled(Link) `
const NavLink = styled(Link) `
	color: ${props => props.theme.light};
	display: block;
	margin: 5px;
	:hover {
		color: ${props => props.theme.mid}
	}
`

export default firebaseConnect()(LeftNav);