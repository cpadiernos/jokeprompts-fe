import React, { Component, Fragment } from "react"
import { Modal, ModalHeader, Button, ModalFooter } from "reactstrap"
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from "axios"

import { JOKES_API_URL } from "../constants"

class ConfirmDeleteModal extends Component {
  state = {
    modal: false
  }
  
  toggle = () => {
    this.setState( prevState => ({
      modal: !prevState.modal
    }))
  }
  
  deleteJoke = async pk => {
    await this.props.jokeService.deleteJoke(pk)
    this.props.getJokes()
    this.toggle()
  }
  
  render() {
    return (
      <Fragment>
        <Button
          aria-label="Delete"
          color="danger"
          onClick={() => this.toggle()}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Delete the joke?
          </ModalHeader>
          <ModalFooter>
            <Button
              type="button"
              onClick={() => this.toggle()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              color="danger"
              onClick={() => this.deleteJoke(this.props.pk)}
            >
              Yes, delete.
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    )
  }
}

export default ConfirmDeleteModal