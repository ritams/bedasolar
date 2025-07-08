import axios from 'axios';
import logger from './logger.js';

export const parseImagesWithLLM = async (imageBuffers) => {
  try {
    // Process all pages and combine results
    const allResults = [];
    
    for (let i = 0; i < imageBuffers.length; i++) {
      const base64Image = imageBuffers[i].toString('base64');
      logger.debug(`Processing page ${i + 1} of ${imageBuffers.length}`);
      
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: "openai/gpt-4o",
        messages: [{
          role: "user",
          content: [{
            type: "text",
            text: `Extract electricity bill information from this image. Return ONLY a JSON object with these exact keys:
{
  "customerName": "customer full name",
  "customerNumber": "customer account number", 
  "supplierName": "electricity supplier company name",
  "billingAddress": "customer billing address",
  "supplyAddress": "electricity supply address",
  "nmi": "National Metering Identifier",
  "meterNumber": "electricity meter number",
  "peakUsage": "peak usage in kWh (number only)",
  "offPeakUsage": "off-peak usage in kWh (number only)",
  "dailySupplyCharge": "daily supply charge period in days (number only)",
  "totalAmount": "total bill amount in dollars (number only)",
  "averageDailyUsage": "average daily usage in kWh (number only)",
  "averageDailyCost": "average daily cost in dollars (number only)",
  "greenhouseGasEmissions": "greenhouse gas emissions in kg (number only)",
  "billingPeriodStart": "billing period start date",
  "billingPeriodEnd": "billing period end date",
  "billingDays": "billing period length in days (number only)"
}

Only extract values that are clearly visible. Use empty string "" for missing text fields and 0 for missing numbers. No additional text.`
          }, {
            type: "image_url",
            image_url: { url: `data:image/png;base64,${base64Image}` }
          }]
        }],
        max_tokens: 500
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3001',
          'X-Title': 'BEDA Solar Onboarding'
        }
      });

      const content = response.data.choices[0].message.content;
      const pageResult = JSON.parse(content.replace(/```json\n?|```/g, '').trim());
      allResults.push(pageResult);
    }
    
    // Combine results from all pages (take non-empty values)
    const combinedResult = combineMultiPageResults(allResults);
    logger.debug('Combined multi-page results:', combinedResult);
    
    return combinedResult;
    
  } catch (error) {
    logger.error('OpenRouter API error:', error.response?.data || error.message);
    throw new Error(`LLM parsing failed: ${error.response?.data?.error?.message || error.message}`);
  }
};

// Helper function to combine results from multiple pages
const combineMultiPageResults = (results) => {
  const combined = {
    customerName: "",
    customerNumber: "",
    supplierName: "",
    billingAddress: "",
    supplyAddress: "",
    nmi: "",
    meterNumber: "",
    peakUsage: 0,
    offPeakUsage: 0,
    dailySupplyCharge: 0,
    totalAmount: 0,
    averageDailyUsage: 0,
    averageDailyCost: 0,
    greenhouseGasEmissions: 0,
    billingPeriodStart: "",
    billingPeriodEnd: "",
    billingDays: 0
  };
  
  // Merge all pages, preferring non-empty/non-zero values
  results.forEach(result => {
    Object.keys(combined).forEach(key => {
      if (result[key]) {
        if (typeof combined[key] === 'string' && result[key] !== "") {
          combined[key] = result[key];
        } else if (typeof combined[key] === 'number' && result[key] > 0) {
          combined[key] = result[key];
        }
      }
    });
  });
  
  return combined;
}; 