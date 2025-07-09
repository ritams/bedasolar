import axios from 'axios';
import logger from './logger.js';

export const parseImagesWithLLM = async (imageBuffers) => {
  try {
    // Prepare all images for Gemini API
    const imageParts = imageBuffers.map(buffer => ({
      inline_data: {
        mime_type: "image/png",
        data: buffer.toString('base64')
      }
    }));

    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent', {
      contents: [{
        parts: [
          ...imageParts,
          {
            text: `<task>
You are an expert data extraction system. Extract electricity bill information from these ${imageBuffers.length} page(s) of an Australian electricity bill. You MUST return ONLY valid JSON - no explanations, no refusals, no additional text.
</task>

<critical_rules>
- DO NOT HALLUCINATE: Only extract values you can clearly see in the images
- If you cannot find a value, use empty string "" for text or 0 for numbers
- NEVER make up, estimate, or guess values
- NEVER return explanations or refusals
- DO NOT HALLUCINATE - this is critical for accuracy
</critical_rules>

<extraction_targets>
<customer_info>
- customerName: Full name from customer details section (DO NOT HALLUCINATE)
- customerNumber: Account/customer number (usually 4-6 digits) (DO NOT HALLUCINATE)
- supplierName: Company name from header/logo area (DO NOT HALLUCINATE)
</customer_info>

<address_info>
- billingAddress: Mailing address for customer (DO NOT HALLUCINATE)
- supplyAddress: Property address where electricity is supplied (DO NOT HALLUCINATE)
</address_info>

<meter_info>
- nmi: National Metering Identifier (10-11 digits, starts with 6, labeled as "NMI") (DO NOT HALLUCINATE)
- meterNumber: Physical meter number (usually 8-10 digits) (DO NOT HALLUCINATE), can contains backslash.
</meter_info>

<usage_data>
- peakUsage: Look in "Billing Calculations" table for Peak Usage kWh - ONLY use POSITIVE numbers, completely IGNORE negative values (DO NOT HALLUCINATE)
- offPeakUsage: Look in "Billing Calculations" table for Off Peak Usage kWh - ONLY use POSITIVE numbers, completely IGNORE negative values (DO NOT HALLUCINATE)
- dailySupplyCharge: Daily supply charge RATE in dollars (e.g. $1.33/day - extract just the rate, not total) (DO NOT HALLUCINATE)
</usage_data>

<billing_info>
- totalBillAmount: "Amount Due" or "TOTAL DUE" in bill summary (main payment amount) (DO NOT HALLUCINATE)
- billingPeriodStart: Start date of billing period (convert to YYYY-MM-DD) (DO NOT HALLUCINATE)
- billingPeriodEnd: End date of billing period (convert to YYYY-MM-DD) (DO NOT HALLUCINATE)
- billingDays: Number of days in billing period (DO NOT HALLUCINATE)
</billing_info>

<calculated_values>
- averageDailyUsage: Look for "Average Daily Usage" text followed by kWh value - if not found, use 0 (DO NOT CALCULATE OR HALLUCINATE)
- averageDailyCost: Look for "Average Daily Cost" or similar text - if not found, use 0 (DO NOT CALCULATE OR HALLUCINATE)
- greenhouseGasEmissions: Look for "Total Greenhouse Gas Emissions" followed by number and "kg" or "kgs" - extract ONLY the number (DO NOT HALLUCINATE)
</calculated_values>
</extraction_targets>

<absolute_requirements>
- NEVER include negative kWh values in any calculation or extraction
- NEVER use meter readings (large numbers like 20000+)
- NEVER confuse rates with totals
- NEVER make up values that aren't clearly visible
- DO NOT HALLUCINATE - return 0 or "" if unsure
</absolute_requirements>

<output_format>
Return ONLY this JSON structure with extracted values:
{
  "customerName": "",
  "customerNumber": "",
  "supplierName": "",
  "billingAddress": "",
  "supplyAddress": "",
  "nmi": "",
  "meterNumber": "",
  "peakUsage": 0,
  "offPeakUsage": 0,
  "dailySupplyCharge": 0,
  "totalBillAmount": 0,
  "averageDailyUsage": 0,
  "averageDailyCost": 0,
  "greenhouseGasEmissions": 0,
  "billingPeriodStart": "",
  "billingPeriodEnd": "",
  "billingDays": 0
}
</output_format>`
          }
        ]
      }]
    }, {
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.candidates[0].content.parts[0].text;
    logger.debug(`Raw AI response: ${content}`);
    
    const cleanContent = content.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanContent);
    
  } catch (error) {
    logger.error('Gemini API error:', error.response?.data || error.message);
    
    // Return empty result on error
    return {
      customerName: "", customerNumber: "", supplierName: "", billingAddress: "", supplyAddress: "",
      nmi: "", meterNumber: "", peakUsage: 0, offPeakUsage: 0, dailySupplyCharge: 0,
      totalBillAmount: 0, averageDailyUsage: 0, averageDailyCost: 0, greenhouseGasEmissions: 0,
      billingPeriodStart: "", billingPeriodEnd: "", billingDays: 0
    };
  }
}; 