class JokeService {
  constructor(client) {
    this.client = client
  }
  
  async getJokes() {
    const { data } = await this.client.get('/jokes/')
    return data
  }
  
  async createJoke(joke) {
    const { data } = await this.client.post('/jokes/', joke)
    return data
  }
  
  async editJoke(pk, joke) {
    const { data } = await this.client.put('/jokes/' + pk, joke)
    return data
  }
  
  async deleteJoke(pk) {
    await this.client.delete('/jokes/' + pk )
    return true
  }
  
}

export default JokeService