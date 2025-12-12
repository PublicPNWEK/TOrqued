export class PersonalizationEngine {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
  }

  async callOpenAI(prompt, temperature, fallbackValue, errorContext) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error(`${errorContext} failed:`, error);
      return fallbackValue;
    }
  }

  async generateRecommendations(userId, userBehavior, inventory) {
    const prompt = `
    User behavior: ${JSON.stringify(userBehavior)}
    Available inventory: ${JSON.stringify(inventory.slice(0, 20))}
    
    Generate personalized product recommendations with reasoning.
    Return JSON format: { recommendations: [{ productId, score, reason }] }
    `;
    
    return this.callOpenAI(prompt, 0.3, { recommendations: [] }, 'AI recommendation');
  }
  
  async optimizePricing(productData, competitorPrices, demandSignals) {
    const prompt = `
    Product: ${JSON.stringify(productData)}
    Competitor prices: ${JSON.stringify(competitorPrices)}
    Demand signals: ${JSON.stringify(demandSignals)}
    
    Suggest optimal pricing strategy. Return JSON: { suggestedPrice, reasoning, confidence }
    `;
    
    const fallback = { 
      suggestedPrice: productData.currentPrice, 
      reasoning: 'Fallback to current price', 
      confidence: 0.5 
    };
    return this.callOpenAI(prompt, 0.2, fallback, 'AI pricing optimization');
  }
}