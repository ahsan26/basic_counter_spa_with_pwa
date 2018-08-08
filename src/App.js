import React, { Component } from 'react';
import './App.css';
import InitializeDB from "./utils/counter_handler";

class App extends Component {
  constructor() {
    super();
    this.state = {
      counter: 0
    };
    this.increment = this.increment.bind(this);
  }
  knowInitialValue = (val, updateCounter, dbRef) => {
    if (val) this.setState({ counter: val });
    this.updateCounter = updateCounter;
    this.dbRef = dbRef;
  }
  componentWillMount = () => {
    InitializeDB(this.knowInitialValue);
  }
  increment() {
    this.setState(prevState => ({ counter: prevState.counter + 1 }), _ => {
      console.log('when passing to utils', this.state.counter)
      this.updateCounter(this.state.counter, this.dbRef);
    });
  }
  render() {
    return (
      <div className="App">
        <h1>Counter</h1>
        <p>{this.state.counter}</p>
        <button onClick={this.increment}>Add</button>
      </div>
    );
  }
}

export default App;
