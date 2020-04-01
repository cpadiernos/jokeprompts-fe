import React, { Component, Fragment } from "react"
import { Row, Col, Button } from "reactstrap"

class Prompt extends Component {
  state = {
    prompt: "",
  }
  
  render() {
    
    return (
      <Fragment>
        <Row className="prompt">
          <Col>
            <h4 data-testid="prompt">{this.props.prompt}</h4>
          </Col>
        </Row>
        <Row className="pb-3 mb-3">
          <Col>
            <Button
              color="success"
              className="float-right"
              style={{ minWidth: "150px" }}
              onClick={this.props.getPrompt}
            >
            Generate
            </Button>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export default Prompt