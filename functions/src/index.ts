/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

const corsHandler = cors({ origin: true });

export const extractResume = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).send({ error: "Method Not Allowed" });
      return;
    }

    try {
      const { text } = req.body;
      
      if (!text) {
        res.status(400).json({ error: "No text provided" });
        return;
      }

      // Initialize Gemini (Ensure your API key is available in your functions environment)
      const apiKey = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        Analyze the following resume text and extract the details into a STRICT JSON format.
        Return ONLY the raw JSON string. Do not include markdown code blocks.
        
        Structure:
        {
          "personal": { "name": "string", "designation": "string" },
          "about": "string",
          "skills": [{ "name": "string", "level": 80 }],
          "experience": [{ "jobTitle": "string", "company": "string", "date": "string", "responsibilities": "string", "description": "string" }],
          "contact": { "linkedin": "string", "github": "string", "email": "string", "phone": "string" }
        }

        Resume Text:
        ${text}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      // Clean up potential markdown formatting
      const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonData = JSON.parse(cleanText);

      // SEND THE SUCCESSFUL RESPONSE
      res.status(200).json(jsonData);
    } catch (error: any) {
      logger.error("Extraction Error:", error);
      res.status(500).json({ error: "Failed to extract resume data." });
    }
  });
});
