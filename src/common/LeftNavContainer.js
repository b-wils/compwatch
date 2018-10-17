import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from 'react-redux'
import styled, {css} from 'styled-components';

import {getCurrentSessionRecord} from '../redux/selectors'
import LeftNavPresentation from './LeftNavPresentation'

const LeftNav = ({sessionRecord}) => (
	<LeftNavPresentation sessionRecord={sessionRecord}/>
)

const mapStateToProps = (state) => {
  return {
  	sessionRecord: getCurrentSessionRecord(state)
  };
}

export default connect(mapStateToProps)(LeftNav);