import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import FakePromptService from './service/FakePromptService'
import FakeJokeService from './service/FakeJokeService'

function initializeFakeServices() {

  const jokes = [{
    pk: 1,
    prompt: 'Joke prompt 1',
    text: 'Joke text 1',
  } , {
    pk: 2,
    prompt: 'Joke prompt 2',
    text: 'Joke text 2',
  }]

  const promptService = new FakePromptService()
  const jokeService = new FakeJokeService(jokes)
  const emptyJokeService = new FakeJokeService()

  return { jokes, promptService, jokeService, emptyJokeService }
}

test('renders without crashing', () => {
  const { promptService, jokeService } = initializeFakeServices()
  const div = document.createElement('div')
  ReactDOM.render(<App promptService={promptService} jokeService={jokeService}/>, div)
})

test('random prompt is displayed when you open app', async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findByText } = render(<App promptService={promptService} jokeService={jokeService} />)
  const randomPrompt = await findByText(/Prompt text [0-9]+/g)
  expect(randomPrompt).toBeInTheDocument()
})

test('generate button is visible' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const generateButton = await findByRole('button', {name: "Generate"})
  expect(generateButton).toBeInTheDocument()
})

test('new random prompt is displayed when you click the generate button', async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findByText, findByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const initialPrompt = await findByText(/Prompt text [0-9]+/g)
  const initialPromptText = initialPrompt.textContent
  const generateButton = await findByRole('button', {name: "Generate"})
  fireEvent.click(generateButton)
  const newPrompt = await findByText(/Prompt text [0-9]+/g)
  const newPromptText = newPrompt.textContent
  expect(newPromptText).not.toBe(initialPromptText) // there is a small chance the random prompt might actually be selected again
})

test('jokes table is visible when you open app' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findByRole} = render(<App promptService={promptService} jokeService={jokeService} />)
  const table = await findByRole('table')
  expect(table).toBeInTheDocument()
})

test('"No jokes!" is displayed when there are no jokes to display' , async () => {
  const { promptService, emptyJokeService } = initializeFakeServices()
  const { findByText } = render(<App promptService={promptService} jokeService={emptyJokeService} />)
  const message = await findByText('No jokes!')
  expect(message).toBeInTheDocument()
})

test('jokes are displayed when there are jokes to display' , async () => {
  const { jokes, promptService, jokeService } = initializeFakeServices()
  const { findByText } = render(<App promptService={promptService} jokeService={jokeService} />)
  for (const joke of jokes) {
    expect(await findByText(joke.prompt)).toBeInTheDocument()
    expect(await findByText(joke.text)).toBeInTheDocument()
  }
})

test('edit buttons are visible when there are jokes that can be edited' , async () => {
  const { jokes, promptService, jokeService } = initializeFakeServices()
  const { findAllByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const numJokes = jokes.length
  const editButtons = await findAllByRole('button', {name: 'Edit'})
  const numEditButtons = editButtons.length
  expect(numEditButtons).toBe(numJokes)
})

test('delete buttons are visible when there are jokes that can be deleted' , async () => {
  const { jokes, promptService, jokeService } = initializeFakeServices()
  const { findAllByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const numJokes = jokes.length
  const deleteButtons = await findAllByRole('button', {name: 'Delete'})
  const numDeleteButtons = deleteButtons.length
  expect(numDeleteButtons).toBe(numJokes)
})

test('clicking edit button will open up "Edit Joke" modal with prompt and joke to edit' , async () => {
  const { jokes, promptService, jokeService } = initializeFakeServices()
  const { findAllByRole, findByText, findByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const editButton = await findAllByRole('button', {name: "Edit"})
  fireEvent.click(editButton[0])
  const editModalMessage = await findByText('Edit Joke')
  expect(editModalMessage).toBeInTheDocument()
  const promptInput = await findByRole('textbox', {name: "Prompt"})
  const promptValue = promptInput.value
  const textInput = await findByRole('textbox', {name: "Text"})
  const textValue = textInput.value
  expect(promptInput).toBeInTheDocument()
  expect(textInput).toBeInTheDocument()
  expect(promptValue).toBe(jokes[0].prompt)
  expect(textValue).toBe(jokes[0].text)
})

test('submitting after invalid editing of joke prompt will show error message on joke prompt' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findAllByRole, findByRole, findByText } = render(<App promptService={promptService} jokeService={jokeService} />)
  const editButton = await findAllByRole('button', {name: "Edit"})
  fireEvent.click(editButton[0])
  const promptInput = await findByRole('textbox', {name: "Prompt"})
  fireEvent.change(promptInput, {target: {value: "" }})
  const submitButton = await findByRole('button', {name: "Submit"})
  fireEvent.click(submitButton)
  const errorMessage = await findByText('This field may not be blank.')
  expect(errorMessage).toBeInTheDocument()
  const inputError = errorMessage.getAttribute("data-testid")
  expect(inputError).toBe('prompt-error')
})

test('submitting after invalid editing of joke text will show error message on joke text' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findAllByRole, findByRole, findByText } = render(<App promptService={promptService} jokeService={jokeService} />)
  const editButton = await findAllByRole('button', {name: "Edit"})
  fireEvent.click(editButton[0])
  const textInput = await findByRole('textbox', {name: "Text"})
  fireEvent.change(textInput, {target: {value: "" }})
  const submitButton = await findByRole('button', {name: "Submit"})
  fireEvent.click(submitButton)
  const errorMessage = await findByText('This field may not be blank.')
  expect(errorMessage).toBeInTheDocument()
  const inputError = errorMessage.getAttribute("data-testid")
  expect(inputError).toBe('text-error')
})

test('submitting after editing valid prompt and joke will update the prompt and joke in the joke list' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findAllByRole, findByRole, findByText } = render(<App promptService={promptService} jokeService={jokeService} />)
  const editButton = await findAllByRole('button', {name: "Edit"})
  fireEvent.click(editButton[0])
  const promptInput = await findByRole('textbox', {name: "Prompt"})
  const textInput = await findByRole('textbox', {name: "Text"})
  fireEvent.change(promptInput, {target: {value: "Changed Joke 1 prompt!"}})
  fireEvent.change(textInput, {target: {value: "Also changed Joke 1 text!"}})
  const submitButton = await findByRole('button', {name: "Submit"})
  fireEvent.click(submitButton)
  const updatedJokePrompt = await findByText("Changed Joke 1 prompt!")
  const updatedJokeText = await findByText("Also changed Joke 1 text!")
  expect(updatedJokePrompt).toBeInTheDocument()
  expect(updatedJokeText).toBeInTheDocument()
})

test('clicking delete button will open up "Delete the joke?" modal' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findAllByRole, findByText } = render(<App promptService={promptService} jokeService={jokeService} />)
  const deleteButton = await findAllByRole('button', {name: "Delete"})
  fireEvent.click(deleteButton[0])
  const deleteModalMessage = await findByText('Delete the joke?')
  expect(deleteModalMessage).toBeInTheDocument()
})

test('clicking the delete button in the delete confirmation modal will remove the joke from the joke list' , async () => {
  const { jokes, promptService, jokeService } = initializeFakeServices()
  const { findAllByRole, findByText, findByRole, queryByText } = render(<App promptService={promptService} jokeService={jokeService} />)
  const numJokesBefore = jokes.length
  const deleteButton = await findAllByRole('button', {name: "Delete"})
  fireEvent.click(deleteButton[0])
  const deleteModalMessage = await findByText('Delete the joke?')
  expect(deleteModalMessage).toBeInTheDocument()
  const confirmButton = await findByRole('button', {name: 'Confirm delete'})
  fireEvent.click(confirmButton)
  expect(await waitForElementToBeRemoved(() => queryByText('Joke prompt 1'))).toBe(true)
  expect(queryByText('Joke prompt 1')).toBeNull()
  expect(queryByText('Joke text 1')).toBeNull()
  const numJokesAfter = jokes.length
  expect(numJokesAfter).toBe(numJokesBefore - 1)
})

test('clicking the cancel button on the delete confirmation modal will not delete anything from the joke list' , async () => {
  const { jokes, promptService, jokeService } = initializeFakeServices()
  const numJokesStart = jokes.length
  const { findAllByRole, findByText, findByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const deleteButton = await findAllByRole('button', {name: "Delete"})
  fireEvent.click(deleteButton[0])
  const deleteModalMessage = await findByText('Delete the joke?')
  expect(deleteModalMessage).toBeInTheDocument()
  const cancelButton = await findByRole('button', {name: 'Cancel'})
  fireEvent.click(cancelButton)
  for (const joke of jokes) {
    expect(await findByText(joke.prompt)).toBeInTheDocument()
    expect(await findByText(joke.text)).toBeInTheDocument()
  }
  const numJokesAfter = jokes.length
  expect(numJokesAfter).toBe(numJokesStart)
})

test('create button is visible' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const createButton = await findByRole('button', {name: "Create"})
  expect(createButton).toBeInTheDocument()
})

test('clicking the create button will open up "Create New Joke" modal with prompt from prompt window' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findByText, findByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const givenPrompt = await findByText(/Prompt text [0-9]+/g)
  const promptText = givenPrompt.textContent
  const createButton = await findByRole('button', {name: "Create"})
  fireEvent.click(createButton)
  const createMessage = await findByText('Create New Joke')
  expect(createMessage).toBeInTheDocument()
  const promptInput = await findByRole('textbox', {name: "Prompt"})
  const inputText = promptInput.value
  expect(inputText).toBe(promptText)
})

test('submitting after creating invalid joke prompt will show error message on joke prompt' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findByText, findByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const createButton = await findByRole('button', {name: "Create"})
  fireEvent.click(createButton)
  const promptInput = await findByRole('textbox', {name: "Prompt"})
  const textInput = await findByRole('textbox', {name: "Text"})
  fireEvent.change(promptInput, {target: {value: ""}})
  fireEvent.change(textInput, {target: {value: "Joke text for failed submit."}})
  const submitButton = await findByRole('button', {name: "Submit"})
  fireEvent.click(submitButton)
  const errorMessage = await findByText("This field may not be blank.")
  expect(errorMessage).toBeInTheDocument()
  const inputError = errorMessage.getAttribute("data-testid")
  expect(inputError).toBe('prompt-error')
})

test('submitting after creating invalid joke text will show error message on joke text' , async () => {
  const { promptService, jokeService } = initializeFakeServices()
  const { findByText, findByRole } = render(<App promptService={promptService} jokeService={jokeService} />)
  const createButton = await findByRole('button', {name: "Create"})
  fireEvent.click(createButton)
  const textInput = await findByRole('textbox', {name: "Text"})
  expect(textInput.value).toBe("")
  const submitButton = await findByRole('button', {name: "Submit"})
  fireEvent.click(submitButton)
  const errorMessage = await findByText("This field may not be blank.")
  expect(errorMessage).toBeInTheDocument()
  const inputError = errorMessage.getAttribute("data-testid")
  expect(inputError).toBe('text-error')
})

test('submitting after creating joke will add the joke to the joke list' , async () => {
  const { jokes, promptService, jokeService } = initializeFakeServices()
  const { findByRole, findByText } = render(<App promptService={promptService} jokeService={jokeService} />)
  const numJokesBefore = jokes.length
  const createButton = await findByRole('button', {name: "Create"})
  fireEvent.click(createButton)
  const promptInput = await findByRole('textbox', {name: "Prompt"})
  const textInput = await findByRole('textbox', {name: "Text"})
  fireEvent.change(promptInput, {target: {value: "New Joke 1 prompt!"}})
  fireEvent.change(textInput, {target: {value: "New Joke 1 text!"}})
  const submitButton = await findByRole('button', {name: "Submit"})
  fireEvent.click(submitButton)
  const newJokePrompt = await findByText("New Joke 1 prompt!")
  const newJokeText = await findByText("New Joke 1 text!")
  expect(newJokePrompt).toBeInTheDocument()
  expect(newJokePrompt).toBeInTheDocument()
  const numJokesAfter = jokes.length
  expect(numJokesAfter).toBe(numJokesBefore + 1)
})

