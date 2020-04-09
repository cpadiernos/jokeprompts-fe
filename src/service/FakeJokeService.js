class FakeJokeService {
  constructor(jokes) {
    this.jokes = jokes ? jokes : []
    }
    
  async getJokes() {
    return this.jokes
  }
  
  async createJoke(joke) {
    if (joke.prompt == "") {
      throw {response: {data: {prompt : "This field may not be blank."}}}
    } else if (joke.text == "") {
      throw {response: {data: {text : "This field may not be blank."}}}
    } else {
      this.jokes.push(joke)
    }
  }
  
  async deleteJoke(pk) {
    for (var i=0; i < this.jokes.length; i++) {
      if (this.jokes[i].pk === pk) {
        this.jokes.splice(i,1)
        break
      }
    }
  }
  
  async editJoke(pk, joke) {
    if (joke.prompt == "") {
      throw {response: {data: {prompt : "This field may not be blank."}}}
    } else if (joke.text == "") {
      throw {response: {data: {text : "This field may not be blank."}}}
    } else {
      const jokeToUpdate = this.jokes.find( pk => pk === pk)
      jokeToUpdate.prompt = joke.prompt
      jokeToUpdate.text = joke.text
    }
  }
}

export default FakeJokeService