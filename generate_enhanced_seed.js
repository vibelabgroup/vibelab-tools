
import { GoogleGenAI, Type } from "@google/genai";
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const toolsList = [
  "ChatGPT", "Google Gemini", "Claude", "Midjourney", "Perplexity AI",
  "Canva Magic Studio", "Jasper", "Copy.ai", "Synthesia", "ElevenLabs",
  "Notion AI", "Runway", "Descript", "HeyGen", "Grammarly",
  "Pictory", "GitHub Copilot", "InVideo AI", "Murf AI", "Leonardo.ai",
  "Otter.ai", "Fireflies.ai", "Writesonic", "Photoroom", "Opus Clip",
  "Gamma", "Fliki", "Surfer SEO", "Beautiful.ai", "Tome",
  "Speechify", "ChatPDF", "Veed.io", "Cursor", "Rytr",
  "Suno AI", "Udio", "Anyword", "QuillBot", "Lovo AI",
  "Hugging Face", "Character.ai", "Looka", "Zapier AI", "Play.ht",
  "Frase", "Scalenut", "Taskade", "CapCut AI", "Replika"
];

async function generateData() {
  console.log("Generating enhanced data for 50 tools...");
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a JSON array of 50 AI tools based on this list: ${toolsList.join(", ")}. 
    For each tool, provide:
    - name: string
    - shortDescription: 1 sentence summary
    - description: A detailed 3-4 sentence overview of the tool.
    - keyFeatures: An array of 4-6 specific key features (strings).
    - category: One of ["Text & Writing", "Image Generation", "Video", "Audio & Speech", "Coding Assistant", "Business"]
    - rating: number between 3.5 and 5.0
    - reviewCount: number between 50 and 5000
    - pricing: One of ["Free", "Freemium", "Paid"]
    - tags: array of 3 relevant strings
    - websiteUrl: realistic URL
    - userReview: A realistic, unique 1-2 sentence user review.
    - userReviewRating: A realistic star rating (from 1.0 to 5.0) for this specific review.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            shortDescription: { type: Type.STRING },
            description: { type: Type.STRING },
            keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            reviewCount: { type: Type.NUMBER },
            pricing: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            websiteUrl: { type: Type.STRING },
            userReview: { type: Type.STRING },
            userReviewRating: { type: Type.NUMBER }
          },
          required: ["name", "shortDescription", "description", "keyFeatures", "category", "rating", "reviewCount", "pricing", "tags", "websiteUrl", "userReview", "userReviewRating"]
        }
      }
    }
  });

  const data = JSON.parse(response.text);
  fs.writeFileSync('seedData.json', JSON.stringify(data, null, 2));
  console.log("Data generated and saved to seedData.json");
}

generateData().catch(console.error);
