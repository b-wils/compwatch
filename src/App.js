import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {heroes: []}
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });


  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
        {this.props.heroes ? 
          this.props.heroes.map((item,i) => <HeroPickerItem key={item.name} hero={item} onChange={this.handleInputChange} checked={this.state[item.name]  ? true : false}/>) :
          <span> Loading Heroes </span>
        }
        </div>

        <div>
        {this.props.maps ? 
          this.props.maps.map((item,i) => <MapPickerItem key={item.name} map={item} onChange={this.handleInputChange} checked={this.state[item.name]  ? true : false}/>) :
          <span> Loading Maps </span>
        }
        </div>
        {!isEmpty(this.props.auth) ?
         <div> Logged in! <button onClick={() => this.props.firebase.logout()}> logout </button></div> :
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
      "backgroundImage": `url(${getImageFromHero(hero)})`,
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
        <label htmlFor={hero.name} style={labelStyle}></label>
      </span>
    );
}


function getImageFromHero(hero) {
  return "/images/heroes/Icon-" + hero.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + ".png";
}

const MapPickerItem = ({map, onChange, checked}) => {
    var labelStyle = {

      "backgroundImage": `url(${getImageFromMap(map)})`,
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
        <input type="checkbox" name={map.name} id={map.name} style={{display:'none'}} onChange={onChange} checked={checked} value={checked}/>
        <label htmlFor={map.name} style={labelStyle}></label>
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