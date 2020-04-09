import React, { Component } from "react"
import { Col, Container, Row } from "reactstrap"
import JokeList from "./JokeList"
import JokeModal from "./JokeModal"
import Prompt from "./Prompt"

class Home extends Component {
  state = {
    jokes: [],
    prompt: "",
  }
  
  async componentDidMount() {
    await this.getPrompt()
    await this.getJokes()
  }
  
  getPrompt = async () => {
    const prompt = await this.props.promptService.getPrompt()
    this.setState({
      prompt,
    })
  }
  
  getJokes = async () => {
    const jokes = await this.props.jokeService.getJokes()
    this.setState({
      jokes,
    })
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
              jokeService={this.props.jokeService}
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
              jokeService={this.props.jokeService}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Home