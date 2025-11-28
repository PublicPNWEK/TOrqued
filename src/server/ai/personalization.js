export class PersonalizationEngine {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
  }

  async generateRecommendations(userId, userBehavior, inventory) {
    const prompt = `
    User behavior: ${JSON.stringify(userBehavior)}
    Available inventory: ${JSON.stringify(inventory.slice(0, 20))}
    
    Generate personalized product recommendations with reasoning.
    Return JSON format: { recommendations: [{ productId, score, reason }] }
    `;
    
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
          temperature: 0.3
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI recommendation failed:', error);
      return { recommendations: [] };
    }
  }
  
  async optimizePricing(productData, competitorPrices, demandSignals) {
    const prompt = `
    Product: ${JSON.stringify(productData)}
    Competitor prices: ${JSON.stringify(competitorPrices)}
    Demand signals: ${JSON.stringify(demandSignals)}
    
    Suggest optimal pricing strategy. Return JSON: { suggestedPrice, reasoning, confidence }
    `;
    
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
          temperature: 0.2
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI pricing optimization failed:', error);
      return { suggestedPrice: productData.currentPrice, reasoning: 'Fallback to current price', confidence: 0.5 };
    }
  }
}