import { createSelector } from 'reselect';
import get from 'lodash.get';
// import differenceInMinutes from 'date-fns/difference_in_minutes';

import getDay from 'date-fns/get_day'
import getHours from 'date-fns/get_hours'
import format from 'date-fns/format'
var differenceInMinutes = require('date-fns/difference_in_minutes')



const TIME_BETWEEN_SESSION_MATCHES_MINUTES = 60

const heroesSelector = state => state.firestore.ordered.heroes || [];
const heroesObjectSelector = state => state.firestore.data.heroes || {};
const mapsSelector = state => state.firestore.ordered.maps || [];
const mapsObjectSelector = state => state.firestore.data.maps || {};
const globalsSelector = state => state.firestore.data.globals || {};
const matchesSelector = state => state.firestore.ordered.matches || [];

// TODO is there a better way to init this and have a selector for it?
var daysObject = {}

for (var i = 0; i <7; i++) {
	daysObject[i] = {day:i};
}

const daysObjectSelector = state => daysObject

var hoursObject = {}

for (var i = 0; i <7; i++) {
	hoursObject[i] = {hour:i};
}

const hoursObjectSelector = state => hoursObject

const emptyObjectSelector = state => {}

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

export const getRatedMatches = createSelector(
	matchesSelector,
	matches => matches.filter(match => match.newSR)
	)

export const getMostRecentMatchSelector = createSelector(
	getMathcesSortedByRecent,
	matches =>  matches[0])

export const getCurrentSRSelector = createSelector(
	getMostRecentMatchSelector,
	match =>  get(match, "newSR", null))

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

// Utility function that will take a smap of objects and calculate win rates
export const makeGetRecordByArray = (matchListSelector, mergeDataSelector) => {
	return createSelector(
		matchListSelector, mergeDataSelector,
		(matchList, mergeData) => {
			var winRates = {}

			Object.keys(matchList).forEach((key) => {
				var data = {
					win: 0,
					loss: 0,
					draw: 0,
					key: key
					// type: mapsObject[map].type

				}

				if (mergeData[key]) {
					data = Object.assign(data, mergeData[key])
				}

				matchList[key].forEach((match) => {

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

				winRates[key] = data;
			})

			return winRates;
		}

	)
}

export const makeSortArrayByWinrate = (winrateArraySelector, secondaryField) => {
	return createSelector(
		winrateArraySelector,
		(winrates) => {
			// console.log(winrates)

			return winrates.sort((a,b)=>{
				if (a.winrate === b.winrate) {
					return a[secondaryField].localeCompare(b[secondaryField])
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
} 

// Matches by Map
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

export const getRecordByMapObject = makeGetRecordByArray(getMatchesGroupedByMap, mapsObjectSelector);

export const getUnsortedRecordByMapArray = createSelector(
	getRecordByMapObject,
	(recordByMap) => {
		return Object.keys(recordByMap).map((key) => {
			recordByMap[key].map = key;
			return recordByMap[key];
		})
	}
)

export const getSortedRecordByMapArray = makeSortArrayByWinrate(getUnsortedRecordByMapArray, 'map')

// Matches by Hero
export const getMatchesGroupedByHero = createSelector(
	matchesSelector, heroesSelector,
	(matches, heroes) => {

		var matchesByHero = heroes.reduce((acc, hero)=> {
			acc[hero.name] = [];

			return acc;
		}, {}) 

		matches.forEach((match) => {
			if (match.heroes === null) {
				return;
			}

			match.heroes.forEach((hero) => {
				matchesByHero[hero].push(match);
			})
		})

		return matchesByHero;
	}
)

export const getRecordByHeroObject = makeGetRecordByArray(getMatchesGroupedByHero, heroesObjectSelector);

export const getUnsortedRecordByHeroArray = createSelector(
	getRecordByHeroObject,
	(recordByHero) => {
		return Object.keys(recordByHero).map((key) => {
			recordByHero[key].hero = key;
			return recordByHero[key];
		})
	}
)


export const getSortedRecordByHeroArray = makeSortArrayByWinrate(getUnsortedRecordByHeroArray, 'hero')

// Matches by day of week
export const getMatchesGroupedByDay = createSelector(
	matchesSelector, heroesSelector,
	(matches, heroes) => {

		var matchesByDay = {}

		for (var i = 0; i<7; i++) {
			matchesByDay[i] = [];
		}

		matches.forEach((match) => {
			if (match.localTime === null) {
				return;
			}

			matchesByDay[getDay(match.localTime.toDate())].push(match);
		})

		return matchesByDay;
	}
)

export const getRecordByDayObject = makeGetRecordByArray(getMatchesGroupedByDay, daysObjectSelector);

export const getUnsortedRecordByDayArray = createSelector(
	getRecordByDayObject,
	(recordByDay) => {
		return Object.keys(recordByDay).map((key) => {
			recordByDay[key].day = key;
			return recordByDay[key];
		})
	}
)

export const getSortedRecordByDayArray = makeSortArrayByWinrate(getUnsortedRecordByDayArray, 'day')

// Matches by hour of week
export const getMatchesGroupedByHour = createSelector(
	matchesSelector,
	(matches) => {

		var matchesByHour = {}

		for (var i = 0; i<24; i++) {
			matchesByHour[i] = [];
		}

		matches.forEach((match) => {
			if (match.localTime === null) {
				return;
			}

			matchesByHour[getHours(match.localTime.toDate())].push(match);
		})

		return matchesByHour;
	}
)

export const getRecordByHourObject = makeGetRecordByArray(getMatchesGroupedByHour, hoursObjectSelector);

export const getUnsortedRecordByHourArray = createSelector(
	getRecordByHourObject,
	(recordByHour) => {
		return Object.keys(recordByHour).map((key) => {
			recordByHour[key].hour = key;
			return recordByHour[key];
		})
	}
)

export const getSortedRecordByHourArray = makeSortArrayByWinrate(getUnsortedRecordByHourArray, 'hour')

// Matches by date
export const getMatchesGroupedByDate = createSelector(
	matchesSelector,
	(matches) => {

		var matchesByDate = {}

		for (var i = 0; i<24; i++) {
			matchesByDate[i] = [];
		}

		matches.forEach((match) => {
			if (match.localTime === null) {
				return;
			}

			var dateStr = format(match.localTime.toDate(), 'YYYY-MM-DD')

			if (matchesByDate[dateStr] === null) {
				matchesByDate[dateStr] = [];
			}

			matchesByDate[dateStr].push(match);
		})

		return matchesByDate;
	}
)

export const getRecordByDateObject = makeGetRecordByArray(getMatchesGroupedByDate, emptyObjectSelector);

export const getUnsortedRecordByDateArray = createSelector(
	getRecordByDateObject,
	(recordByDate) => {
		return Object.keys(recordByDate).map((key) => {
			recordByDate[key].date = key;
			return recordByDate[key];
		})
	}
)

export const getSortedRecordByDateArray = makeSortArrayByWinrate(getUnsortedRecordByDateArray, 'date')


// getCurrentSessionRecord
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