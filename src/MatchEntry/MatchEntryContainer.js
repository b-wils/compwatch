import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import { withFirebase } from 'react-redux-firebase'
import {sortedMapsSelector, sortedHeroesSelector, currentSeasonSelector, getCurrentSRSelector} from '../redux/selectors'

class MatchEntry extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      newSR: "",
      selectedHeroes: {},
      selectedMap: null,
      message: "",
      currentSR: 0
    }
    this.heroSelectChange = this.heroSelectChange.bind(this);
    this.mapSelectChange = this.mapSelectChange.bind(this);
    this.newSRChange = this.newSRChange.bind(this);
    this.currentSRChange = this.currentSRChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  newSRChange(event) {
    var newSR = event.target.value;
    
    if (newSR === '') {
      newSR = 0;
    }

    this.setState({
      newSR: parseInt(newSR),
      message: ""
    }, () => this.updateResults())

  }

  currentSRChange(event) {
    var currentSR = event.target.value;
    
    if (currentSR === '') {
      currentSR = 0;
    }

    this.setState({
      currentSR: parseInt(currentSR),
      message: ""
    }, ()=> this.updateResults())
  }

  updateResults() {

    var {newSR, currentSR} = this.state;

    currentSR = parseInt(currentSR, 10)
    newSR = parseInt(newSR, 10)
    var SRDiff = newSR - currentSR;

    var result;

    if (newSR > currentSR) {
      result = 'win'
    } else if (newSR < currentSR) {
      result = 'loss'
    } else {
      result = 'draw'
    }

    this.setState({
      SRDiff: SRDiff,
      result: result
    })
  }

  heroSelectChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    var newSelectedHeroes = this.state.selectedHeroes;

    newSelectedHeroes[name] = value

    this.setState({
      selectedHeroes: newSelectedHeroes,
      message: ""
    });

  }

  mapSelectChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      selectedMap: name,
      message: ""
    });

  }


  handleSubmit(event) {

    event.preventDefault();

    var firestore = this.context.store.firestore
    var {selectedHeroes, selectedMap, newSR, currentSR} = this.state;

    currentSR = parseInt(currentSR, 10)

    var result;

    if (newSR > currentSR) {
      result = 'win'
    } else if (newSR < currentSR) {
      result = 'loss'
    } else {
      result = 'draw'
    }

    var newMatch = {
      heroes: Object.keys(selectedHeroes).filter((key) => {return selectedHeroes[key] !== false;  }),
      map: selectedMap,
      lastSR: this.props.lastSR,
      currentSR: currentSR,
      newSR: parseInt(newSR, 10),
      isCurrentSRChanged: (this.props.lastSR != currentSR),
      userId: this.props.auth.uid,
      firebaseTime: firestore.FieldValue.serverTimestamp(),
      localTime: new Date(),
      result: result,
      season: this.props.season
    }
    firestore.add({collection: 'matches'}, newMatch)

    this.setState({
      newSR: "",
      selectedHeroes: {},
      selectedMap: null,
      message: "Match submitted",
      currentSR: newSR
    })

  }

  render() {
    return (
      <div className="MatchEntry">
        {this.state.message ? <div> {this.state.message}</div> : null}
        <form onSubmit={this.handleSubmit}>
          <div>
            Current SR: <input type="text" name="currentSR" value={this.state.currentSR} onChange={this.currentSRChange}/>
            New SR: <input type="text" name="newSR" value={this.state.newSR} onChange={this.newSRChange}/>
            Result: {this.state.result} SR Change: {this.state.SRDiff}
          </div>

          <div>
          {this.props.sortedHeroes ? 
            Object.keys(this.props.sortedHeroes).map((heroType, i) => {
              return (
                <div key={heroType}>
                  <div>{heroType}:</div>
                  
                  {this.props.sortedHeroes[heroType].map((item,i) => 
                    <HeroPickerItem key={item.name} hero={item} onChange={this.heroSelectChange} checked={this.state.selectedHeroes[item.name]  ? true : false}/>
                  )}
                  
                </div>
              )
            })
            : <span> Loading Maps </span>
          }
          </div>

          <div>
          {this.props.sortedMaps ? 
            Object.keys(this.props.sortedMaps).map((mapType, i) => {
              return (
                <div key={mapType}>
                  <div>{mapType}:</div>
                  
                  {this.props.sortedMaps[mapType].map((item,i) => 
                    <MapPickerItem key={item.name} map={item} onChange={this.mapSelectChange} checked={this.state.selectedMap === item.name  ? true : false}/>
                  )}
                  
                </div>
              )
            })
            : <span> Loading Maps </span>
          }
          </div>

          {!isEmpty(this.props.auth) ?
           <div><input type="submit" value="Submit" /></div> :
            null }
        </form>

          {!isEmpty(this.props.auth) ?
           <button onClick={() => this.props.firebase.logout()}> logout </button> :
           <button  onClick={() => this.props.firebase.login({ provider: 'google', type: 'popup' })}>
             Login With Google</button> }
      </div>
    );

  }

  componentDidMount() {
    const { firestore } = this.context.store;
    const userId = this.props.auth.uid;

    

    firestore.get('heroes');
    firestore.get('maps');
    firestore.get('globals');
    firestore.get({collection: 'matches', where: ['userId', '==', userId], orderBy: ['firebaseTime', 'desc']})
        .then(()=>{
          this.setState({currentSR: this.props.lastSR})
        });


    firestore.setListener({ collection: 'matches', where: ['userId', '==', userId], orderBy: ['firebaseTime', 'desc'] })
  }
}

const HeroPickerItem = ({hero, onChange, checked}) => {
    var labelStyle = {
      height: "90px",
      width: "101px",
      display:"inline-block",
      padding: "0 0 0 0px",
      borderStyle: 'solid',
      borderColor: 'white',
      position:'relative',
      'textShadow': '-1px -1px 1px rgba(0,0,0,0.667), 1px 1px 1px #000000'
  }

  if (checked) {
    labelStyle['borderColor'] = "red";
    labelStyle['borderStyle'] = "solid";
  }

  return (
      <span>
        <input type="checkbox" name={hero.name} id={hero.name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <label htmlFor={hero.name} style={labelStyle}>
          <img src={getImageFromHero(hero)} title={hero.name} alt={hero.name} width='100%' height='100%' style={{backgroundColor:'black'}} />
          <span style={{position:'absolute', bottom: '5px', left:'50%', transform:'translate(-50%, 0)', color:'white'}}> {hero.name} </span>
        </label>

      </span>
    );
}


function getImageFromHero(hero) {
  return process.env.PUBLIC_URL + "/images/heroes/Icon-" + hero.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + ".png";
}

const MapPickerItem = ({map, onChange, checked}) => {
    var labelStyle = {
      height: "90px",
      width: "101px",
      display:"inline-block",
      padding: "0 0 0 0px" ,
      borderStyle: 'solid',
      borderColor: 'white',
      position:'relative',
      'textShadow': '-1px -1px 1px rgba(0,0,0,0.667), 1px 1px 1px #000000'
  }

  if (checked) {
    labelStyle['borderColor'] = "red";
  }

  return (
      <span>
        <input type="radio" name={map.name} id={map.name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <label htmlFor={map.name} style={labelStyle}>
          <img src={getImageFromMap(map)} alt={map.name} title={map.name} width='100%' height='100%'/>
          <span style={{position:'absolute', bottom: '5px', left:'40%', transform:'translate(-40%, 0)', color:'white'}}> {map.name} </span>
        </label>
      </span>
    );

}


function getImageFromMap(map) {
  return process.env.PUBLIC_URL + "/images/maps/" + map.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + "_link.png";
}

const mapStateToProps = (state, ownProps = {}) => {
  return {
    auth: state.firebase.auth,
    sortedHeroes: sortedHeroesSelector(state),
    sortedMaps: sortedMapsSelector(state),
    season: currentSeasonSelector(state),
    lastSR: getCurrentSRSelector(state)
  };
}

MatchEntry.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps)
)(MatchEntry)