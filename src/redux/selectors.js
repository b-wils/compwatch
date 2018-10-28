import { createSelector } from 'reselect';
import get from 'lodash.get';
// import differenceInMinutes from 'date-fns/difference_in_minutes';
var differenceInMinutes = require('date-fns/difference_in_minutes')

const TIME_BETWEEN_SESSION_MATCHES_MINUTES = 60

const heroesSelector = state => state.firestore.ordered.heroes || [];
const mapsSelector = state => state.firestore.ordered.maps || [];
const mapsObjectSelector = state => state.firestore.data.maps || {};
const globalsSelector = state => state.firestore.data.globals || {};
const matchesSelector = state => state.firestore.ordered.matches || [];

// Global Selectors
export const currentSeasonSelector = createSelector(
	globalsSelector,
	globals => get(globals, 'season.season', undefined))

// Hero selectors
export const supportHeroesSelector = createSelector(
	heroesSelector,
	heroes => heroes.filter(hero => hero.role.toLowerCase() === "support"))

export const tankHeroesSelector = createSelector(
	heroesSelector,
	heroes => heroes.filter(hero => hero.role.toLowerCase() === "tank"))

export const damageHeroesSelector = createSelector(
	heroesSelector,
	heroes => heroes.filter(hero => hero.role.toLowerCase() === "damage"))


export const sortedHeroesSelector = createSelector(supportHeroesSelector, tankHeroesSelector, damageHeroesSelector,
	(supportHeroes, tankHeroes, damageHeroes) => {
		return {
			damage: damageHeroes,
			support: supportHeroes,
			tank: tankHeroes,	
		}
	})

// Map selectors
export const assaultMapsSelector = createSelector(
	mapsSelector,
	maps => maps.filter(maps => maps.type.toLowerCase() === "assault"))

export const escortMapsSelector = createSelector(
	mapsSelector,
	maps => maps.filter(maps => maps.type.toLowerCase() === "escort"))

export const hybridMapsSelector = createSelector(
	mapsSelector,
	maps => maps.filter(maps => maps.type.toLowerCase() === "hybrid"))

export const controlMapsSelector = createSelector(
	mapsSelector,
	maps => maps.filter(maps => maps.type.toLowerCase() === "control"))

export const sortedMapsSelector = createSelector(assaultMapsSelector, escortMapsSelector, hybridMapsSelector, controlMapsSelector,
	(assaultMaps, escortMaps, hybridMaps, controlMaps) => {
		return {
			assault: assaultMaps,
			escort: escortMaps,
			hybrid: hybridMaps,
			control: controlMaps
		}
	})

// Match selecotrs

// By default matches are sorted by most recent first
export const getMathcesSortedByRecent = createSelector(
	matchesSelector,
	matches => matches)

export const getMostRecentMatchSelector = createSelector(
	getMathcesSortedByRecent,
	matches =>  matches[0])

export const getCurrentSRSelector = createSelector(
	getMostRecentMatchSelector,
	match =>  get(match, "newSR", 0))

// TODO since the selector will cache results based on input, it can give stale results if sufficient time has passed 
export const getCurrentSessionMatches = createSelector(
	getMathcesSortedByRecent,
	(matches) => {
		// TODO we should probably use the firebase server time for consistency, not sure how to get that though
		var lastGameTime = new Date();
		var sessionMatches = [];

		for (var i = 0; 
				 i < matches.length && 
				 differenceInMinutes(lastGameTime, matches[i].localTime.toDate()) < TIME_BETWEEN_SESSION_MATCHES_MINUTES; 
				 i++) 
		{
			lastGameTime = matches[i].localTime.toDate();
			sessionMatches.push(matches[i]);
		}

		return sessionMatches;
	} 
)

export const getMatchesGroupedByMap = createSelector(
	matchesSelector, mapsSelector,
	(matches, maps) => {

		var matchesByMap = maps.reduce((acc, map)=> {
			acc[map.name] = [];

			return acc;
		}, {}) 

		matches.forEach((match) => {
			if (match.map === null) {
				return;
			}

			matchesByMap[match.map].push(match);
		})

		return matchesByMap;
	}
)

export const getRecordByMap = createSelector(
	getMatchesGroupedByMap, mapsObjectSelector,
	(matchesByMap, mapsObject) => {
		var winRates = {}

		Object.keys(matchesByMap).forEach((map) => {
			var data = {
				win: 0,
				loss: 0,
				draw: 0,
				key: map,
				type: mapsObject[map].type

			}

			matchesByMap[map].forEach((match) => {

				if (!match.result) {
					return;
				}

				data[match.result] += 1;
			})

			data.total = data.win + data.loss + data.draw;

			if (data.total) {
				data.winrate = (data.win + data.draw/2) / data.total;
			} else {
				data.winrate = undefined;
			}

			winRates[map] = data;
		})

		return winRates;
	}
)

export const getUnsortedRecordByMap = createSelector(
	getRecordByMap,
	(recordByMap) => {
		return Object.keys(recordByMap).map((key) => {
			recordByMap[key].map = key;
			return recordByMap[key];
		})
	}
)

export const getSortedRecordByMap = createSelector(
	getUnsortedRecordByMap,
	(unsortedRecordByMap) => {

		return unsortedRecordByMap.sort((a,b)=>{
			if (a.winrate === b.winrate) {
				return a.map.localeCompare(b.map)
			} else if (a.winrate === undefined) {
				return 1;
			} else if (b.winrate === undefined) {
				return -1
			} else {
				return b.winrate - a.winrate
			}
		})
	}
)

export const getCurrentSessionRecord = createSelector(
	getCurrentSessionMatches,
	(matches) => {
		return {
			wins: matches.filter(match => match.result === 'win').length,
			losses: matches.filter(match => match.result === 'loss').length,
			draws: matches.filter(match => match.result === 'draw').length
		}
	}
)