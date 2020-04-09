import React, { Component } from "react"
import { Table } from "reactstrap"
import JokeModal from "./JokeModal"

import ConfirmDeleteModal from "./ConfirmDeleteModal"

class JokeList extends Component {
  render() {
    const jokes = this.props.jokes

    return (
      <Table>
        <thead className="thead-dark">
          <tr>
            <th>Prompt</th>
            <th>Joke</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!jokes || jokes.length <=0 ? (
            <tr>
              <td colSpan="6" align="center">
                <b>No jokes!</b>
              </td>
            </tr>
          ) : (
            jokes.map( joke => (
              <tr key={joke.pk}>
                <td>{joke.prompt}</td>
                <td>{joke.text}</td>
                <td align="right">
                  <JokeModal
                    create={false}
                    joke={joke}
                    getJokes={this.props.getJokes}
                    jokeService={this.props.jokeService}
                  />
                  &nbsp;&nbsp;
                  <ConfirmDeleteModal
                    pk={joke.pk}
                    getJokes={this.props.getJokes}
                    jokeService={this.props.jokeService}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    )
  }
}

export default JokeList