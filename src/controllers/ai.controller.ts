import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai'; 
import dotenv from 'dotenv';

dotenv.config();


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiController = {
  
  generateTrip: async (req: Request, res: Response) => {
    try {
      const { destination, days, budget, travelStyle, tripDate } = req.body;

      if (!days || !budget) {
        return res.status(400).json({ message: "Days and budget are required" });
      }

      const dateContext = tripDate || "next month";

      
      const prompt = `
        Act as a Sri Lankan Travel & Weather Expert.
        
        Request: Plan a ${days}-day trip.
        User Input Destination: "${destination || "Suggest the best location based on weather"}"
        Date/Month: ${dateContext}
        Budget: ${budget} LKR
        Style: ${travelStyle}

        LOGIC TO FOLLOW:
        1. Analyze the weather in the requested destination for ${dateContext}.
        2. Sri Lanka has two monsoons. 
           - South/West (Galle, Colombo) is rainy May-Sept.
           - North/East (Trinco, Arugam Bay) is rainy Oct-Jan.
        3. IF the user picked a specific destination that has BAD weather:
           - Fill "weatherWarning" field with a caution.
           - Suggest an alternative location in "alternativeLocation".
        4. IF destination is empty, pick the BEST sunny location for ${dateContext}.

        OUTPUT FORMAT (Strict JSON, No Markdown):
        {
          "title": "Trip Title",
          "weatherWarning": "null or string warning",
          "alternativeLocation": "string",
          "budget": ${budget},
          "travelStyle": "${travelStyle}",
          "stops": [
            {
              "order": 1,
              "locationName": "City Name",
              "coordinates": { "lat": 0.0, "lng": 0.0 }, 
              "hotel": { "name": "Hotel Name", "pricePerNight": 0, "address": "Address" },
              "activities": [
                { "name": "Activity 1", "isCompleted": false }
              ]
            }
          ]
        }
      `;

      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json"
        }
      });

     
      let text = response.text || "";

      // Sanitize potential code block markers if present
      text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
     
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const rawJson = jsonMatch ? jsonMatch[0] : text;
      
      const tripPlan = JSON.parse(rawJson);
      tripPlan.isAiGenerated = true;

      res.status(200).json(tripPlan);

    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ 
        message: "Failed to generate trip", 
        error: error.message 
      });
    }
  }
};