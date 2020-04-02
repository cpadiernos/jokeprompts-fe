import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios'
import { API_URL } from "./constants"
import JokeService from "./service/JokeService"
import PromptService from "./service/PromptService"

const client = axios.create({
  baseURL: API_URL,
})

const jokeService = new JokeService(client)
const promptService = new PromptService(client)

ReactDOM.render(<App jokeService={jokeService} promptService={promptService}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
