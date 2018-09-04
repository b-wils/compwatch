import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js'; // <--- add this line

class App extends Component {
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
      </div>
    );
  }

  componentDidMount() {
    firebase.firestore().collection('heroes').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
            })
        });

  }
}

export default App;
