import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, ComplianceDocument } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Part = result.split(',')[1];
      resolve(base64Part);
    };
    reader.onerror = error => reject(error);
  });
};

export const analyzeDocument = async (file: File): Promise<Partial<ComplianceDocument>> => {
  try {
    const base64Data = await fileToBase64(file);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data
              }
            },
            {
              text: `Analyze this document and extract the following information in JSON format:
              1. title: The official title of the document.
              2. type: The type of document (Regulation, Guideline, Internal Policy, or Audit Requirement).
              3. region: The jurisdiction (e.g., Malaysia, Global).
              4. department: The most relevant department (e.g., Fund Management, Risk, Digital Assets).
              5. lastUpdated: The date of the document (YYYY-MM-DD).
              6. summary: A concise executive summary (max 2 sentences).
              7. content: The full text content of the document, preserving headers and structure. Add [Page X] markers if possible.
              8. tags: An array of 3-5 keywords.
              `
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            type: { type: Type.STRING },
            region: { type: Type.STRING },
            department: { type: Type.STRING },
            lastUpdated: { type: Type.STRING },
            summary: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No response from AI model");

  } catch (error) {
    console.error("Error analyzing document:", error);
    throw error;
  }
};

export const queryComplianceEngine = async (
  history: ChatMessage[],
  query: string,
  contextDocuments: ComplianceDocument[]
): Promise<string> => {
  
  // Construct a grounding context from the documents
  const contextString = contextDocuments.length > 0 ? contextDocuments.map((doc, index) => {
    return `[Document ID: ${doc.id}]
Title: ${doc.title}
Source: ${doc.source}
Region: ${doc.region}
Type: ${doc.type}
Content:
${doc.content}
---`;
  }).join('\n') : "No specific context documents found.";

  const systemInstruction = `
    You are i-Patuh, a friendly, intelligent, and highly capable Compliance Assistant.
    Your personality is helpful, professional, and natural—similar to a knowledgeable human colleague.

    YOUR GOAL:
    Provide clear, natural language answers to the user's questions. You are an expert in Securities Commission Malaysia (SC) regulations, internal policies, and compliance guidelines.

    INSTRUCTIONS:
    1. **Be Natural & Conversational**: Avoid sounding robotic. Use connecting phrases. You can say "Sure, here's what I found..." or "Based on the guidelines...".
    2. **Handle Greetings**: If the user says "Hi", "Hello", or "Who are you?", respond naturally without looking for a policy document. (e.g., "Hello! I'm i-Patuh, your compliance assistant. How can I help you check the regulations today?").
    3. **Use the Context**: When asked about specific topics (e.g., Cloud, AML, e-KYC), base your answers STRICTLY on the "CONTEXT DOCUMENTS" provided below.
    4. **Precise Citations**: You must cite your sources. 
       - The text contains page markers like [Page 5]. 
       - If you extract information found under a page marker, include the page number in your citation tag using the pipe '|' separator.
       - Format: [[doc-id|Page X]] or [[doc-id]].
       - Example: "The minimum paid-up capital is RM10 million [[guidelines-on-cfds|Page 2]]."
    5. **Highlight Conflicts**: If you spot conflicting information between documents, point it out helpfully.
    6. **Formatting**: Use Markdown to make your text easy to read (bolding key terms, using bullet points).

    CONTEXT DOCUMENTS:
    ${contextString}
  `;

  try {
    // Check if the query is a simple greeting to avoid wasting tokens or getting weird RAG responses
    const lowerQuery = query.toLowerCase().trim();
    if (['hi', 'hello', 'hey', 'good morning', 'test'].includes(lowerQuery)) {
      return "Hello! I am i-Patuh, your AI-powered compliance research assistant. I can help you navigate SC regulations, internal policies, and audit guidelines. What would you like to search for today?";
    }

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
        temperature: 0.5, // Lower temperature for more accuracy on citations
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time. Could you please rephrase your question?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered a technical issue while analyzing the documents. Please try again in a moment.";
  }
};
