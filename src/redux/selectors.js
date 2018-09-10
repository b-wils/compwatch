import { createSelector } from 'reselect'

const heroesSelector = state => state.firestore.ordered.heroes || [];
const mapsSelector = state => state.firestore.ordered.maps || [];

// Hero selectors
export const supportHeroesSelector = createSelector(
	heroesSelector,
	heroes => heroes.filter(hero => hero.role.toLowerCase() == "support"))

export const tankHeroesSelector = createSelector(
	heroesSelector,
	heroes => heroes.filter(hero => hero.role.toLowerCase() == "tank"))

export const damageHeroesSelector = createSelector(
	heroesSelector,
	heroes => heroes.filter(hero => hero.role.toLowerCase() == "damage"))


export const sortedHeroesSelector = createSelector(supportHeroesSelector, tankHeroesSelector, damageHeroesSelector,
	(supportHeroes, tankHeroes, damageHeroes) => {
		return {
			support: supportHeroes,
			tank: tankHeroes,
			damage: damageHeroes
		}
	})

// Map selectors
export const assaultMapsSelector = createSelector(
	mapsSelector,
	maps => maps.filter(maps => maps.type.toLowerCase() == "assault"))

export const escortMapsSelector = createSelector(
	mapsSelector,
	maps => maps.filter(maps => maps.type.toLowerCase() == "escort"))

export const hybridMapsSelector = createSelector(
	mapsSelector,
	maps => maps.filter(maps => maps.type.toLowerCase() == "hybrid"))

export const controlMapsSelector = createSelector(
	mapsSelector,
	maps => maps.filter(maps => maps.type.toLowerCase() == "control"))

export const sortedMapsSelector = createSelector(assaultMapsSelector, escortMapsSelector, hybridMapsSelector, controlMapsSelector,
	(assaultMaps, escortMaps, hybridMaps, controlMaps) => {
		return {
			assault: assaultMaps,
			escort: escortMaps,
			hybrid: hybridMaps,
			control: controlMaps
		}
	})