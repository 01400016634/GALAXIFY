import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing. Please create a .env file in the root directory.");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Get the specific model instance
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generates a professional 3-sentence bio.
 * @param {string} designation - The user's job title.
 * @param {string[]} skillsArray - List of skills.
 * @returns {Promise<string>} - The generated bio text.
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
 * @param {string} jobTitle
 * @param {string} company
 * @param {string} type - 'responsibilities' or 'description'
 * @param {string} currentText - Optional existing text to regenerate/improve
 * @returns {Promise<string>}
 */
export const generateExperience = async (jobTitle, company, type, currentText = "") => {
  try {
    let prompt = `Write a professional ${type} for a resume for the position of ${jobTitle} at ${company}. Provide concise, impactful bullet points.`;
    
    if (currentText) {
      prompt += `\n\nThe user did not like this previous text: "${currentText}". Please regenerate, rephrase, and improve it to be more professional and engaging.`;
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
 * @param {string} title - The title of the research paper.
 * @param {string} currentText - Optional existing text to regenerate/improve
 * @returns {Promise<string>} - The generated analysis.
 */
export const generateResearchAnalysis = async (title, currentText = "") => {
  try {
    let prompt = `Provide a structured 3-sentence summary analyzing the core findings of the research paper titled "${title}". Focus on the methodology, key results, and implications.`;
    
    if (currentText) {
      prompt += `\n\nThe user did not like this previous text: "${currentText}". Please regenerate, rephrase, and improve it to be more professional and engaging.`;
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
 * Extracts structured data from raw resume text into JSON.
 * @param {string} pdfText - The raw text content of a resume.
 * @returns {Promise<Object>} - The structured JSON object.
 */
/*
export const extractResume = async (pdfText) => {
  try {
    const prompt = `
      Analyze the following resume text and extract the details into a STRICT JSON format.
      Do not include markdown formatting (like \`\`\`json). Just return the raw JSON string.
      
      You MUST extract any mention of publications, journals, or research into the 'research' array. You MUST extract all technical and soft skills into the 'skills' array. Find all URLs and emails and put them in 'contact'.
      
      Structure:
      {
        "name": "string",
        "designation": "string",
        "aboutMe": "string",
        "skills": [{ "name": "string", "level": 80 }],
        "experience": [{ "jobTitle": "string", "company": "string", "date": "string", "responsibilities": "string (extract bullet points)", "description": "string" }],
        "projects": [{ "description": "string", "link": "string" }],
        "research": [{ "title": "string", "journal_date": "string", "description": "string", "link": "string" }],
        "contact": { "linkedin": "string", "github": "string", "email": "string", "phone": "string", "personalWebsite": "string" }
      }

      Resume Text:
      ${pdfText}
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown code blocks if the model adds them
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error extracting resume:", error);
    throw error;
  }
};
*/

// TEMPORARY BYPASS: Mock function to avoid 429 Quota Errors while testing
export const extractResume = async (pdfText) => {
  console.log("⚠️ Bypassing Google API due to quota limits. Using mock data.");
  
  // Simulate a 2-second loading time so your UI spinners still work
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return exactly what the AI WOULD have returned
  return {
    personal: {
      name: "Ireen Sultana",
      designation: "Senior Scientific Officer",
    },
    about: "An experienced environmental and soil science professional with over a decade of expertise in soil, water, fertilizer, and plant analysis. Proven leadership in managing ISO/IEC 17025 accredited laboratories.",
    skills: [
      { name: "Laboratory Analysis", level: 95 },
      { name: "ISO/IEC 17025 Quality Management", level: 90 },
      { name: "Data Management & GIS", level: 85 },
      { name: "Spectrophotometry", level: 80 }
    ],
    experience: [
      {
        jobTitle: "Senior Scientific Officer",
        company: "Soil Resource Development Institute (SRDI)",
        date: "June 2021 - Present",
        responsibilities: "• Lead comprehensive laboratory analyses of soil, water, and fertilizers.\n• Manage quality control for ISO/IEC 17025 accredited lab.\n• Conduct training programs for agricultural stakeholders.",
        description: "Directing analytical laboratory services and ensuring rigorous quality standards for national agricultural and environmental initiatives."
      },
      {
        jobTitle: "Scientific Officer",
        company: "Soil Resource Development Institute",
        date: "2012 - 2021",
        responsibilities: "• Conducted routine soil and water testing.\n• Assisted in mobile soil testing laboratory operations.",
        description: "Executed foundational analytical testing to support regional agricultural development."
      }
    ],
    research: [],
    contact: {
      email: "ireenabti2015@gmail.com",
      phone: "+8801710391944",
      linkedin: "https://linkedin.com/in/ireensultana"
    }
  };
};