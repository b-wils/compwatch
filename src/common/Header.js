import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled, {css} from 'styled-components';

const HeaderHeight = '150px'

const Header = () => (
	<HeaderBuffer>
		<HeaderDiv>
			OverLogger
		</HeaderDiv>
	</HeaderBuffer>
)

const HeaderDiv = styled.div `
	width: 100%;
	height: ${HeaderHeight};
	background-color: ${props => props.theme.primary};
	color: ${props => props.theme.light};
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
	font-size: 4em;
	position: fixed;
	top: 0px;
	z-index: 90;
	border-bottom: 2px solid ${props => props.theme.mid};
`

const HeaderBuffer = styled.div `
	width: 100%;
	min-height: ${HeaderHeight};
`

const BottomHeaderButtons = styled.div `
	align-self: flex-end;
`

export default Header;