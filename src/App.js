import React, { Component, Fragment } from 'react'
import Header from "./components/Header"
import Home from "./components/Home"

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Home jokeService={this.props.jokeService} promptService={this.props.promptService}/>
      </Fragment>
    )
  }
}

export default App;
