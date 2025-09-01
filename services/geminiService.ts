
import { GoogleGenAI } from "@google/genai";
import { MarketAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMarketAnalysis(): Promise<MarketAnalysis> {
    const prompt = `
You are a world-class financial analyst for the Arabic-speaking market, specializing in gold.
Your task is to provide a comprehensive analysis of the current gold market.
Using the latest information from Google Search, provide the following information strictly in a single JSON object. Do not add any text, markdown, or commentary outside of the JSON object. The entire response must be parseable JSON.

The JSON object should have the following structure and content:
{
  "globalPriceUSD": <number, latest price of gold per ounce in USD>,
  "localPriceEGP": <number, latest price of a 24k gold gram in Egyptian Pounds (EGP)>,
  "priceChange": {
    "change": <number, 24-hour price change in USD for the global price>,
    "changePercent": <number, 24-hour price change percentage for the global price>
  },
  "marketSentiment": <"Positive", "Negative", or "Neutral", based on overall news and price action>,
  "geopoliticalSummary": "<string, 2-3 sentence summary in Arabic of the current geopolitical factors influencing the gold price>",
  "newsFeed": [
    {
      "title": "<string, news headline in Arabic>",
      "source": "<string, source of the news, e.g., 'Reuters'>",
      "summary": "<string, a brief one-sentence summary of the article in Arabic>"
    }
  ],
  "forecast": {
    "shortTerm": {
      "prediction": "<'صعودي' | 'هبوطي' | 'مستقر', prediction for the next 7 days>",
      "reasoning": "<string, brief reasoning in Arabic>"
    },
    "longTerm": {
      "prediction": "<'صعودي' | 'هبوطي' | 'مستقر', prediction for the next 3 months>",
      "reasoning": "<string, brief reasoning in Arabic>"
    }
  },
  "chartData": [
    // Array of 30 objects representing plausible historical daily prices for the last 30 days for the global price, ending with today's price.
    { "date": "YYYY-MM-DD", "price": <number> },
    ...
  ]
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    // The model might return the JSON wrapped in markdown or with other text.
    // We need to extract the raw JSON string before parsing.
    let jsonText = response.text.trim();
    const startIndex = jsonText.indexOf('{');
    const endIndex = jsonText.lastIndexOf('}');

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        console.error("No valid JSON object found in Gemini response:", response.text);
        throw new Error("Received a response without a valid JSON object from the AI.");
    }
    
    jsonText = jsonText.substring(startIndex, endIndex + 1);

    try {
        const analysisData = JSON.parse(jsonText) as Omit<MarketAnalysis, 'sources'>;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) ?? [];

        return {
            ...analysisData,
            sources: sources.map(s => ({ uri: s.uri, title: s.title || s.uri }))
        };

    } catch (e) {
        console.error("Failed to parse Gemini response for market analysis:", jsonText);
        if (e instanceof Error) {
            console.error("Parse error:", e.message);
        }
        throw new Error("Received an invalid format from the AI for market analysis.");
    }
}
