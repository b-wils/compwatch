import React from 'react';
import styled from 'styled-components/macro';
import {css} from 'styled-components';
import {List} from 'antd'
import { Link } from "react-router-dom";

import format from 'date-fns/format'

const MatchHistoryPresentation = ({matches}) => (
	<div>
		<List
		      bordered
		      dataSource={matches}
		      renderItem={match => (<MatchListItem match={match}/>)}
		    />
	</div>
)

const MatchListItem = ({match}) => (
	<List.Item>
		<Link to={`matches/${match.id}`}>
			{format(match.localTime.toDate(), "ddd MMM Do h:mm A")} - {match.result} - {match.map} - {match.heroes.join(', ')} - {`${match.newSR} SR`}	
		</Link>
	</List.Item>
)
export default MatchHistoryPresentation;