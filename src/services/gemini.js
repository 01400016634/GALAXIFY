import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing. Please create a .env file in the root directory.");
}

const genAI = new GoogleGenerativeAI(apiKey);
// Using gemini-2.5-flash for speed and better free-tier limits
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

/**
 * REAL AI EXTRACTION: Fetches structured data from resume text.
 */
export const extractResume = async (pdfText) => {
  // 1. Initialize the correct model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Extract the following information from this resume text and return it strictly as a JSON object:
    {
      "personal": { "name": "", "designation": "" },
      "about": "",
      "skills": [{ "name": "", "level": 0 }],
      "experience": [{ "jobTitle": "", "company": "", "date": "", "responsibilities": "", "description": "" }],
      "contact": { "email": "", "phone": "" }
    }
    Resume Text: ${pdfText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Clean the response text to ensure it is valid JSON
    const text = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Extraction Error:", error);
    throw error;
  }
};