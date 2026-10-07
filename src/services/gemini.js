import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing. Please create a .env file in the root directory.");
}

const genAI = new GoogleGenerativeAI(apiKey);
// Using gemini-2.5-flash for speed and better free-tier limits
const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

/**
 * Generates a professional 3-sentence bio.
 */
export const generateAboutMe = async (designation, skillsArray) => {
  try {
    const prompt = `Write a professional, engaging 3-sentence portfolio bio for a ${designation} skilled in ${skillsArray.join(', ')}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating bio:", error);
    throw error;
  }
};

/**
 * Generates professional experience details.
 */
export const generateExperience = async (jobTitle, company, type, currentText = "") => {
  try {
    let prompt = `Write a professional ${type} for a resume for the position of ${jobTitle} at ${company}. Provide concise, impactful bullet points.`;
    if (currentText) {
      prompt += `\n\nThe user did not like this previous text: "${currentText}". Please regenerate and improve it.`;
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating experience:", error);
    throw error;
  }
};

/**
 * Generates a research paper analysis.
 */
export const generateResearchAnalysis = async (title, currentText = "") => {
  try {
    let prompt = `Provide a structured 3-sentence summary analyzing the core findings of the research paper titled "${title}".`;
    if (currentText) {
      prompt += `\n\nThe user did not like this previous text: "${currentText}". Please improve it.`;
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating research analysis:", error);
    throw error;
  }
};

export const extractResume = async (base64Pdf) => {
  // 1. Initialize the correct model, forcing JSON output for reliability
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.8-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
    You are an expert resume parser. Extract the following information from the provided PDF resume.
    You must carefully reconstruct the semantic flow, identify contact info scattered across headers, and format bullet points cleanly.
    
    Return the data strictly using this JSON schema:
    {
      "fullName": "",
      "designation": "",
      "aboutMe": "A short summary or objective",
      "skills": [{ "name": "", "level": 80 }],
      "experience": [{ "jobTitle": "", "company": "", "dateRange": "", "responsibilities": "Cleanly formatted bullet points" }],
      "education": [{ "degree": "", "institution": "", "yearRange": "" }]
    }
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Pdf,
          mimeType: "application/pdf"
        }
      }
    ]);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("AI Extraction Error:", error);
    throw error;
  }
};