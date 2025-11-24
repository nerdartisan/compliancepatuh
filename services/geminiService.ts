import { GoogleGenAI } from "@google/genai";
import { ChatMessage, ComplianceDocument } from "../types";
import { MOCK_DOCUMENTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const queryComplianceEngine = async (
  history: ChatMessage[],
  query: string,
  contextDocuments: ComplianceDocument[] = MOCK_DOCUMENTS
): Promise<string> => {
  
  // Construct a grounding context from the documents
  const contextString = contextDocuments.map((doc, index) => {
    return `[Document ID: ${doc.id}]
Title: ${doc.title}
Source: ${doc.source}
Region: ${doc.region}
Type: ${doc.type}
Content Excerpt:
${doc.content}
---`;
  }).join('\n');

  const systemInstruction = `
    You are Lexicon, an advanced Compliance Research Engine.
    Your goal is to provide authoritative, accurate, and cited answers to compliance questions.
    
    CRITICAL RULES:
    1. Base your answer ONLY on the provided Context Documents below.
    2. If the context does not contain the answer, state that there is no relevant policy found in the corpus.
    3. You must CITE your sources explicitly. Use the format [[id]] when making a claim that comes from a specific document.
       Example: "Data must be retained for 7 years [[doc-001]]."
    4. Highlight conflicts. If one document says "5 years" and another says "7 years", explicitly point out this discrepancy and explain which might prevail based on the text (e.g., local regulation overriding global policy).
    5. Maintain a scholarly, professional, and objective tone.
    6. Structure your answer with clear headings or bullet points if necessary.

    CONTEXT DOCUMENTS:
    ${contextString}
  `;

  try {
    const model = ai.models.generateContent;
    
    // Convert history to format if needed, but for this single-turn/short-history demo, 
    // we will just append the current query to the prompt with the history as context if desired.
    // Ideally, we use ai.chats.create, but we are injecting a large dynamic context block each time for this RAG simulation.
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Previous conversation context: ${history.map(h => `${h.role}: ${h.content}`).join('\n')}` },
            { text: `Current Query: ${query}` }
          ]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for factual accuracy
      }
    });

    return response.text || "I could not generate a response based on the available documents.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while analyzing the compliance corpus. Please check your network or API limits.";
  }
};
