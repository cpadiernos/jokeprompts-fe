import React from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"

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
  
  createJoke = async event => {
    event.preventDefault()
    try {
      await this.props.jokeService.createJoke(this.state)
      this.props.getJokes()
      this.props.toggle()
    } catch(error) {
      if (error.response) {
        this.setState({
          errorMessagePrompt: error.response.data.prompt,
          errorMessageText: error.response.data.text,
        })
      }
    }
  }
  
  editJoke = async event => {
    event.preventDefault()
    try {
      await this.props.jokeService.editJoke(this.state.pk, this.state)
      this.props.getJokes()
      this.props.toggle()
    } catch(error) {
      if (error.response) {
        this.setState({
          errorMessagePrompt: error.response.data.prompt,
          errorMessageText: error.response.data.text,
        })
      }
    }
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