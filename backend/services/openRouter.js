import axios from 'axios';

export const parseImageWithLLM = async (imageBuffer) => {
  const base64Image = imageBuffer.toString('base64');
  
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "openai/gpt-4o",
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: "Extract the following fields from this invoice image and return ONLY a JSON object with keys: name, email, address, invoiceNumber. No additional text."
        }, {
          type: "image_url",
          image_url: { url: `data:image/png;base64,${base64Image}` }
        }]
      }],
      max_tokens: 300
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'PDF Parser App'
      }
    });

    console.log('OpenRouter response:', response.data);
    const content = response.data.choices[0].message.content;
    return JSON.parse(content.replace(/```json\n?|```/g, '').trim());
    
  } catch (error) {
    console.error('OpenRouter API error:', error.response?.data || error.message);
    throw new Error(`LLM parsing failed: ${error.response?.data?.error?.message || error.message}`);
  }
}; 