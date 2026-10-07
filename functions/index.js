const functions = require("firebase-functions");
const cors = require("cors")({ origin: true }); 
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Replace this with your actual Gemini API Key
const genAI = new GoogleGenerativeAI("AIzaSyD5V-oybXtd577cNUg4RLXrUHUhOthQk6k"); 

exports.extractResume = functions.https.onRequest((req, res) => {
  
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
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
      
      const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // ADD THIS LINE TO SEE WHAT THE AI SAID:
      console.log("AI RAW RESPONSE:", cleanText); 
      
      const jsonData = JSON.parse(cleanText);

      res.status(200).json(jsonData);

    } catch (error) {
      console.error("Extraction Error:", error);
      res.status(500).json({ error: error.message || error.toString() });
    }
  });
});