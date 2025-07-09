import axios from 'axios';
import logger from './logger.js';

export const parseImagesWithLLM = async (imageBuffers) => {
  try {
    // Prepare all images for single API call
    const imageContent = imageBuffers.map((buffer, index) => ({
      type: "image_url",
      image_url: { url: `data:image/png;base64,${buffer.toString('base64')}` }
    }));

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "openai/gpt-4o",
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: `You are a data extraction system. Extract electricity bill information from these ${imageBuffers.length} page(s) of an Australian electricity bill and return ONLY valid JSON. Analyze all images together as they represent a complete multi-page bill:

{
  "customerName": "full customer name (may appear in header, customer details, or address section)",
  "customerNumber": "customer/account number (typically 4-12 digits)",
  "supplierName": "electricity company name (look for logos, headers, company names)",
  "billingAddress": "customer's billing/mailing address", 
  "supplyAddress": "electricity supply address (property where electricity is delivered)",
  "nmi": "National Metering Identifier (10-11 digits, often starts with 6, may be labeled as NMI)",
  "meterNumber": "electricity meter number (found in meter details/reads section)",
  "peakUsage": "peak/standard/daytime usage in kWh for the billing period (look in usage tables, billing calculations)",
  "offPeakUsage": "off-peak/night usage in kWh for the billing period (look in usage tables, billing calculations)", 
  "dailySupplyCharge": "daily supply charge amount in dollars per day (fixed daily connection fee)",
  "totalBillAmount": "total bill amount in dollars (Amount Due, Total Due, Amount Payable - the main amount to pay)",
  "averageDailyUsage": "average daily usage in kWh (may be calculated or stated explicitly)",
  "averageDailyCost": "average daily cost in dollars (calculate from total amount / billing days if not stated)",
  "greenhouseGasEmissions": "greenhouse gas emissions in kg (CO2, emissions, environmental impact)",
  "billingPeriodStart": "billing period start date (extract as YYYY-MM-DD format)",
  "billingPeriodEnd": "billing period end date (extract as YYYY-MM-DD format)", 
  "billingDays": "number of days in billing period (typically 28-92 days)"
}

Return ONLY the JSON object, no explanations. Use empty string "" for missing text fields and 0 for missing numbers.`
        }, ...imageContent]
      }],
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'BEDA Solar Onboarding'
      }
    });

    const content = response.data.choices[0].message.content;
    logger.debug(`Raw AI response: ${content}`);
    
    const cleanContent = content.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanContent);
    
  } catch (error) {
    logger.error('OpenRouter API error:', error.response?.data || error.message);
    
    // Return empty result on error
    return {
      customerName: "", customerNumber: "", supplierName: "", billingAddress: "", supplyAddress: "",
      nmi: "", meterNumber: "", peakUsage: 0, offPeakUsage: 0, dailySupplyCharge: 0,
      totalBillAmount: 0, averageDailyUsage: 0, averageDailyCost: 0, greenhouseGasEmissions: 0,
      billingPeriodStart: "", billingPeriodEnd: "", billingDays: 0
    };
  }
}; 