import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js'; // <--- add this line

class App extends Component {
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
        {this.state.heroes.map((item,i) => <span key={item.name}><img src={getImageFromHero(item)}/></span>)}
      </div>
    );

  }

  componentDidMount() {
    firebase.firestore().collection('heroes').get().then((querySnapshot) => {
            this.setState({heroes: querySnapshot.docs.map((doc) => doc.data()) })
        });
  }
}

function getImageFromHero(hero) {
  return "/images/heroes/Icon-" + hero.name.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + ".png";
}

export default App;
