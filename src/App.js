import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
          this.props.heroes.map((item,i) => <span key={item.name}><img src={getImageFromHero(item)}/></span>) :
          <span> Loading Heroes </span>
        }
      </div>
    );

  }

  componentDidMount() {
    const { firestore } = this.context.store
    firestore.get('heroes')
  }
}

function getImageFromHero(hero) {
  return "/images/heroes/Icon-" + hero.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + ".png";
}

const mapStateToProps = (state, ownProps = {}) => {
  // console.log(state.firestore.data)
  return {heroes: state.firestore.ordered.heroes};
}

export default connect(mapStateToProps)(App)