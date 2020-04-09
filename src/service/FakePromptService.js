class FakePromptService {
  constructor() {
    this.prompts = []

    for (let num = 0; num < 50; num++){
      this.prompts.push({
        pk: num,
        text: "Prompt text " + num,
      })
    }
  }
  
  async getPrompt() {
    const numPrompts = this.prompts.length
    var randomNumber = Math.floor(Math.random() * ( numPrompts ))
    const randomPrompt = this.prompts[randomNumber]
    return randomPrompt.text
  }
}

export default FakePromptService