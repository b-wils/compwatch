import React from 'react';
import styled from 'styled-components/macro';
import {css} from 'styled-components';
import {List, Avatar, Tooltip, Row, Col} from 'antd'
import { Link } from "react-router-dom";
import get from "lodash.get"
import format from 'date-fns/format'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

import {getImageForHero, getImageForMap} from '../util'

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
	
	<Link to={`/matches/${match.id}`}>
		<List.Item>
		
					<MatchInfo>
						<Tooltip title={match.map}>
							<Avatar src={getImageForMap(match.map)} shape="square" alt={get(match, 'map.name')} title={get(match, 'map.name')} size={64}/>
						</Tooltip>
						<MatchSRLabel result={match.result}> 
							{match.placementMatch ? 'Placement' : `${match.newSR} SR`} 
						</MatchSRLabel>
						{match.heroes.map((hero) => {
							return (
								<Tooltip title={hero} key={match.id + hero}>
									<Avatar src={getImageForHero(hero)} shape="square" alt={hero} size={48} />
								</Tooltip>
								)
						})}
					</MatchInfo>
					<MatchTimeDistanceLabel>
						{distanceInWordsToNow(match.localTime.toDate())} ago
					</MatchTimeDistanceLabel>
				

		
		</List.Item>
	</Link>
)

const MatchSRLabel = styled.span `
	font-size: 20px;
	color: ${props => getColorForResult(props.result)};
`

const MatchTimeDistanceLabel = styled.div `
	font-size: 16px;
	color: black;
`

const MatchInfo = styled.div `
	// width: 70%;
`

const getColorForResult = (result) => {
	switch (result) {
		case 'win':
			return 'green';
			break;
		case 'loss':
			return 'red';
			break;
		case 'draw':
		default:
			return 'gray'
			break;
	}
}

export default MatchHistoryPresentation;