import React from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"

import axios from "axios"

import { JOKES_API_URL } from "../constants"

class JokeForm extends React.Component {
  state = {
    pk: 0,
    prompt: "",
    errorMessagePrompt: "",
    text: "",
    errorMessageText: "",
  }
  
  componentDidMount() {
    if(this.props.joke) {
      const { pk, prompt, text } = this.props.joke;
      this.setState({ pk, prompt, text })
    } else {
      this.setState({ prompt: this.props.prompt })
    }
  }
  
  onChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }
  
  createJoke = event => {
    event.preventDefault()
    axios.post(JOKES_API_URL, this.state)
      .then( () => {
        this.props.getJokes()
        this.props.toggle()
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            errorMessagePrompt: error.response.data.prompt,
            errorMessageText: error.response.data.text,
          })
        }
      })
  }
  
  editJoke = event => {
    event.preventDefault()
    axios.put(JOKES_API_URL + this.state.pk, this.state)
      .then( () => {
        this.props.getJokes()
        this.props.toggle()
      })
  }
  
  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  }
  
  render() {
    return (
      <Form onSubmit={this.props.joke ? this.editJoke : this.createJoke}>
        <FormGroup>
          <Label for="prompt">Prompt:</Label>
          <p className="text-danger">
            {this.state.errorMessagePrompt}
          </p>
          <Input 
            type="text"
            name="prompt"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.prompt)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="text">Text:</Label>
          <p className="text-danger">
            {this.state.errorMessageText}
          </p>
          <Input 
            type="text"
            name="text"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.text)}
          />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    )
  }
}

export default JokeForm