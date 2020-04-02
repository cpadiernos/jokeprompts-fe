import React, { Component, Fragment } from "react"
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap"
import JokeForm from "./JokeForm"
import { faEdit} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class JokeModal extends Component {
  state = {
    modal: false
  }

  toggle = () => {
    this.setState( prevState => ({
      modal: !prevState.modal
    }))
  }
  
  render() {
    const create = this.props.create
    
    var title = "Edit Joke"
    var button = <Button aria-label="Edit" onClick={this.toggle}><FontAwesomeIcon icon={faEdit} /></Button>
    
    if (create) {
      title = "Create New Joke"
      
      button = (
        <Button
          color="primary"
          className="float-right"
          onClick={this.toggle}
          style={{ minWidth: "150px" }}
        >
          Create
        </Button>
      )
    }
    
    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader
            toggle={this.toggle}
          >
            {title}
          </ModalHeader>
          <ModalBody>
            <JokeForm
              prompt={this.props.prompt}
              getJokes={this.props.getJokes}
              jokeService={this.props.jokeService}
              toggle={this.toggle}
              joke={this.props.joke}
            />
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

export default JokeModal