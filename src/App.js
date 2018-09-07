import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import { withFirebase } from 'react-redux-firebase'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      newSR: "",
      selectedHeroes: {},
      selectedMap: null,
      message: ""
    }
    this.heroSelectChange = this.heroSelectChange.bind(this);
    this.mapSelectChange = this.mapSelectChange.bind(this);
    this.newSRChange = this.newSRChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  newSRChange(event) {
    var newSR = event.target.value;
    this.setState({
      newSR: newSR,
      message: ""
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
    var {selectedHeroes, selectedMap, newSR} = this.state;

    var newGame = {
      heroes: Object.keys(selectedHeroes).filter((key) => {return selectedHeroes[key] !== false;  }),
      map: selectedMap,
      newSR: parseInt(newSR, 10),
      userId: this.props.auth.uid,
      firebaseTime: firestore.FieldValue.serverTimestamp(),
      localTime: new Date()
    }

    firestore.add('games', newGame)

    this.setState({
      newSR: "",
      selectedHeroes: {},
      selectedMap: null,
      message: "Game submitted"
    })

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {this.state.message ? <div> {this.state.message}</div> : null}
        <form onSubmit={this.handleSubmit}>
          <div>
            New SR: <input type="text" name="newSR" value={this.state.newSR} onChange={this.newSRChange}/>
          </div>
          <div>
          {this.props.heroes ? 
            this.props.heroes.map((item,i) => <HeroPickerItem key={item.name} hero={item} onChange={this.heroSelectChange} checked={this.state.selectedHeroes[item.name]  ? true : false}/>) :
            <span> Loading Heroes </span>
          }
          </div>

          <div>
          {this.props.maps ? 
            this.props.maps.map((item,i) => <MapPickerItem key={item.name} map={item} onChange={this.mapSelectChange} checked={this.state.selectedMap === item.name  ? true : false}/>) :
            <span> Loading Maps </span>
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
    firestore.get('heroes');
    firestore.get('maps');
  }
}

const HeroPickerItem = ({hero, onChange, checked}) => {
    var labelStyle = {
      height: "100px",
      width: "112px",
      display:"inline-block",
      padding: "0 0 0 0px",
      borderStyle: 'solid',
      borderColor: 'white'
  }

  if (checked) {
    labelStyle['borderColor'] = "red";
    labelStyle['borderStyle'] = "solid";
  }

  return (
      <span>
        <input type="checkbox" name={hero.name} id={hero.name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <label htmlFor={hero.name} style={labelStyle}> <img src={getImageFromHero(hero)} title={hero.name} alt={hero.name}/></label>
      </span>
    );
}


function getImageFromHero(hero) {
  return "/images/heroes/Icon-" + hero.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + ".png";
}

const MapPickerItem = ({map, onChange, checked}) => {
    var labelStyle = {
      height: "100px",
      width: "112px",
      display:"inline-block",
      padding: "0 0 0 0px" ,
      borderStyle: 'solid',
      borderColor: 'white'
  }

  if (checked) {
    labelStyle['borderColor'] = "red";
  }

  return (
      <span>
        <input type="radio" name={map.name} id={map.name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <label htmlFor={map.name} style={labelStyle}><img src={getImageFromMap(map)} alt={map.name} title={map.name}/></label>
      </span>
    );

}


function getImageFromMap(map) {
  return "/images/maps/" + map.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + "_link.png";
}

const mapStateToProps = (state, ownProps = {}) => {
  return {
    heroes: state.firestore.ordered.heroes,
    auth: state.firebase.auth,
    maps: state.firestore.ordered.maps
  };
}

App.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps)
)(App)