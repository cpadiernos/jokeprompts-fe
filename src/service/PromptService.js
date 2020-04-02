class PromptService {
  constructor(client) {
    this.client = client
  }
  
  async getPrompt() {
    const { data } = await this.client.get('/prompts/random/')
    return data.text
  }
}

export default PromptService