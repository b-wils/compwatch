import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled, {css} from 'styled-components';

const NAV_WIDTH = '200px'

const LeftNav = () => (
	<LeftNavBuffer>
		<LeftNavDiv>
			LeftNav
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

const LeftNavBuffer  = styled.div `
	width: ${NAV_WIDTH};
	min-height: 100vh;
	float: left;
	position: relative;
`

export default LeftNav;