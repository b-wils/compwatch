import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled, {css} from 'styled-components';

const NAV_WIDTH = '200px'

const LeftNav = ({sessionRecord}) => (
	<LeftNavBuffer>
		<LeftNavDiv>
			Session Record: {`${sessionRecord.wins} - ${sessionRecord.losses} - ${sessionRecord.draws}`}
		</LeftNavDiv>
	</LeftNavBuffer>
)

const LeftNavDiv = styled.div `
	width: ${NAV_WIDTH};
	min-height: 100%;
	background-color: black;
	color: white;
	position: fixed;
`

// TODO need a good way for nav height to fill remaining space
const LeftNavBuffer  = styled.div `
	width: ${NAV_WIDTH};
	min-height: 80vh;
	float: left;
	position: relative;
`

export default LeftNav;