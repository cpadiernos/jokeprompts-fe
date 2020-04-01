import React, { Component } from "react"
import { Col, Container, Row } from "reactstrap"
import JokeList from "./JokeList"
import JokeModal from "./JokeModal"
import Prompt from "./Prompt"

import axios from "axios"

import { JOKES_API_URL, RANDOM_PROMPT_API_URL } from "../constants"

class Home extends Component {
  state = {
    jokes: [],
    prompt: "",
  }
  
  componentDidMount() {
    this.getJokes()
    this.getPrompt()
  }

  getJokes = () => {
    axios.get(JOKES_API_URL)
      .then( response =>
        this.setState({
          jokes: response.data
        })
      )
  }
  
  getPrompt = () => {
    axios.get(RANDOM_PROMPT_API_URL)
      .then( response =>
        this.setState({
          prompt: response.data.text,
        })
      )
  }
  
  render() {
    return(
      <Container>
        <Row>
          <Col>
            <Prompt
              prompt={this.state.prompt}
              getPrompt={this.getPrompt}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <JokeList
              jokes={this.state.jokes}
              getJokes={this.getJokes}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <hr/>
            <JokeModal
              prompt={this.state.prompt}
              create={true}
              getJokes={this.getJokes}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Home