import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeData, AnalysisReport, UserConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

// Schema definition for structured output
const outputSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    matchScore: { type: Type.INTEGER, description: "0-100 score based on keyword match" },
    targetRole: { type: Type.STRING, description: "The target job title identified" },
    foundKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific advice on where to add missing keywords" },
    coverLetter: { type: Type.STRING, description: "A tailored cover letter 200-350 words" },
    linkedinSummary: { type: Type.STRING, description: "A professional LinkedIn About section summary" },
    resume: {
      type: Type.OBJECT,
      properties: {
        contact: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            location: { type: Type.STRING }
          }
        },
        summary: { type: Type.STRING },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              role: { type: Type.STRING },
              company: { type: Type.STRING },
              dates: { type: Type.STRING },
              bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              degree: { type: Type.STRING },
              school: { type: Type.STRING },
              year: { type: Type.STRING }
            }
          }
        },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  },
  required: ["matchScore", "resume", "coverLetter", "analysis", "targetRole"]
};

export const generateOptimizedContent = async (
  resumeText: string,
  jobDescription: string,
  config: UserConfig
): Promise<{
  resume: ResumeData;
  coverLetter: string;
  linkedinSummary: string;
  analysis: AnalysisReport;
  targetRole: string;
}> => {
  
  const nicheContext = config.primaryNiche && config.primaryNiche !== 'Other' 
    ? `specializing in the "${config.primaryNiche}" industry${config.subNiche ? ` (specifically ${config.subNiche})` : ''}`
    : `specializing in general recruitment`;

  const systemInstruction = `
    You are an expert ATS Resume Optimizer and Career Coach for the "${config.seniority}" level, ${nicheContext}.
    Your Tone: ${config.tone}.
    
    Task:
    1. Analyze the candidate's resume text and the target job description.
    2. Extract and restructure the resume data.
    3. Rewrite the resume summary and experience bullets to be ATS-friendly.
       - Use action verbs.
       - Incorporate keywords from the job description NATURALLY.
       - Use format: "Action verb + task + tools + result".
       - DO NOT invent facts. If metrics are missing, use "[add metric]" as a placeholder.
       - Focus heavily on terminology relevant to ${config.subNiche || config.primaryNiche} if specified.
    4. Calculate a match score (0-100).
    5. Identify found and missing keywords.
    6. Write a tailored cover letter (200-350 words) that appeals to hiring managers in ${config.primaryNiche}.
    7. Write a LinkedIn summary.

    Constraints:
    - Do not hallucinate employment history or degrees.
    - Ensure the JSON output matches the provided schema strictly.
    - Experience 'id' and Education 'id' should be simple strings like 'exp-1', 'edu-1'.
  `;

  const prompt = `
    RESUME TEXT:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: outputSchema,
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    return {
      resume: data.resume,
      coverLetter: data.coverLetter,
      linkedinSummary: data.linkedinSummary,
      targetRole: data.targetRole,
      analysis: {
        matchScore: data.matchScore,
        foundKeywords: data.foundKeywords,
        missingKeywords: data.missingKeywords,
        recommendations: data.recommendations
      }
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate optimized content. Please try again.");
  }
};

export const regenerateSection = async (
  currentContent: string,
  instruction: string,
  type: 'summary' | 'bullet' | 'coverLetter'
): Promise<string> => {
  const prompt = `
    Original Text: "${currentContent}"
    
    Instruction: ${instruction}
    
    Task: Rewrite the original text following the instruction. Keep it professional and ATS friendly.
    Return ONLY the rewritten text, no JSON, no markdown.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  return response.text || currentContent;
};