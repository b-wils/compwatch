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
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload. My edits! IS this gonig???
        </p>
        {this.props.heroes ? 
          this.props.heroes.map((item,i) => <HeroPickerItem key={item.name} hero={item} />) :
          <span> Loading Heroes </span>
        }
        {!isEmpty(this.props.auth) ?
         <div> Logged in! <button onClick={() => this.props.firebase.logout()}> logout </button></div> :
         <button  onClick={() => this.props.firebase.login({ provider: 'google', type: 'popup' })}>
           Login With Google</button> }
      </div>
    );

  }

  componentDidMount() {
    const { firestore } = this.context.store
    firestore.get('heroes')
  }
}

const HeroPickerItem = ({hero}) => {
  return (
      <span key={hero.name}><img src={getImageFromHero(hero)}/></span>
    );
}

function getImageFromHero(hero) {
  return "/images/heroes/Icon-" + hero.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + ".png";
}

const mapStateToProps = (state, ownProps = {}) => {
  return {
    heroes: state.firestore.ordered.heroes,
    auth: state.firebase.auth
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