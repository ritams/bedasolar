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
            text: `You are a data extraction system. Extract electricity bill information from this Australian electricity bill image and return ONLY valid JSON. Do not refuse or explain - always return the JSON structure even if some fields are unclear:

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

EXTRACTION GUIDELINES:
- SCAN THE ENTIRE BILL - information may be in headers, tables, summaries, or detailed sections
- Look for USAGE TABLES with kWh amounts - these are your peak/off-peak usage values
- IGNORE meter readings (large numbers like 20000+ that represent cumulative meter totals)
- Peak usage might be labeled as: Peak, Standard, Daytime, Tariff 1, etc.
- Off-peak might be labeled as: Off-Peak, Night, Economy, Tariff 2, etc.
- TOTAL BILL AMOUNT (CRITICAL): Look for the main payment amount - labeled as "Amount Due", "Total Amount", "Balance Due", "Total Charges", "Amount Payable" - usually in a prominent box or summary section
- Daily supply charge is the fixed daily connection fee (typically $0.50-$2.00 per day)
- NMI is always 10-11 digits, often highlighted or in a separate box
- Billing period dates are usually clearly marked - convert to YYYY-MM-DD format
- DAILY CALCULATIONS (IMPORTANT): If averages aren't shown, calculate them:
  * averageDailyUsage = (peakUsage + offPeakUsage) ÷ billingDays
  * averageDailyCost = totalBillAmount ÷ billingDays
- Use empty string "" for missing text fields and 0 for missing numbers
- CRITICAL: Return ONLY the JSON object, no explanations, refusals, or other text
- If image is unclear, still return the JSON structure with empty/zero values
- Start your response with { and end with }`
          }, {
            type: "image_url",
            image_url: { url: `data:image/png;base64,${base64Image}` }
          }]
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
      
      // Check if response starts with refusal
      if (content.toLowerCase().includes("i'm unable") || content.toLowerCase().includes("i cannot")) {
        logger.warn('AI refused to process image, using empty result');
        allResults.push({
          customerName: "", customerNumber: "", supplierName: "", billingAddress: "", supplyAddress: "",
          nmi: "", meterNumber: "", peakUsage: 0, offPeakUsage: 0, dailySupplyCharge: 0,
          totalBillAmount: 0, averageDailyUsage: 0, averageDailyCost: 0, greenhouseGasEmissions: 0,
          billingPeriodStart: "", billingPeriodEnd: "", billingDays: 0
        });
        continue;
      }
      
      try {
        const cleanContent = content.replace(/```json\n?|```/g, '').trim();
        const pageResult = JSON.parse(cleanContent);
        allResults.push(pageResult);
      } catch (parseError) {
        logger.warn(`JSON parse failed for page ${i + 1}: ${parseError.message}`);
        logger.debug(`Content that failed to parse: ${content}`);
        // Use empty result for this page
        allResults.push({
          customerName: "", customerNumber: "", supplierName: "", billingAddress: "", supplyAddress: "",
          nmi: "", meterNumber: "", peakUsage: 0, offPeakUsage: 0, dailySupplyCharge: 0,
          totalBillAmount: 0, averageDailyUsage: 0, averageDailyCost: 0, greenhouseGasEmissions: 0,
          billingPeriodStart: "", billingPeriodEnd: "", billingDays: 0
        });
      }
    }
    
    // Combine results from all pages (take non-empty values)
    const combinedResult = combineMultiPageResults(allResults);
    logger.debug('Combined multi-page results:', combinedResult);
    
    return combinedResult;
    
  } catch (error) {
    logger.error('OpenRouter API error:', error.response?.data || error.message);
    
    // Return empty result instead of throwing error to prevent complete failure
    logger.warn('Returning empty extraction result due to API error');
    return {
      customerName: "", customerNumber: "", supplierName: "", billingAddress: "", supplyAddress: "",
      nmi: "", meterNumber: "", peakUsage: 0, offPeakUsage: 0, dailySupplyCharge: 0,
      totalBillAmount: 0, averageDailyUsage: 0, averageDailyCost: 0, greenhouseGasEmissions: 0,
      billingPeriodStart: "", billingPeriodEnd: "", billingDays: 0
    };
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
    totalBillAmount: 0,
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
          let value = result[key];
          
          // Validate and correct unrealistic values
          if (key === 'peakUsage' || key === 'offPeakUsage') {
            // If usage is over 10,000 kWh, likely in Wh - convert to kWh
            if (value > 10000) {
              value = value / 1000;
              logger.debug(`Converted ${key} from ${result[key]} Wh to ${value} kWh`);
            }
            // Cap at reasonable max (5000 kWh per billing period)
            if (value > 5000) {
              logger.warn(`Unrealistic ${key}: ${value} kWh, setting to 0`);
              value = 0;
            }
          }
          
          if (key === 'averageDailyUsage' && value > 100) {
            logger.warn(`Unrealistic daily usage: ${value} kWh, setting to 0`);
            value = 0;
          }
          
          if (key === 'averageDailyCost' && value > 100) {
            logger.warn(`Unrealistic daily cost: $${value}, setting to 0`);
            value = 0;
          }
          
          if (key === 'billingDays' && (value > 365 || value < 1)) {
            logger.warn(`Unrealistic billing days: ${value}, setting to 30`);
            value = 30;
          }
          
          combined[key] = value;
        }
      }
    });
  });
  
  // If billing address is empty, use supply address
  if (!combined.billingAddress && combined.supplyAddress) {
    combined.billingAddress = combined.supplyAddress;
    logger.debug('Set billing address to match supply address');
  }
  
  return combined;
}; 