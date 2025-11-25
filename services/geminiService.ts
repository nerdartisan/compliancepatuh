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
    You are i-Patuh, a friendly, intelligent, and highly capable Compliance Assistant.
    Your personality is helpful, professional, and natural—similar to a knowledgeable human colleague.

    YOUR GOAL:
    Provide clear, natural language answers to the user's questions. You are an expert in Bank Negara Malaysia (BNM) regulations, internal policies, and compliance guidelines.

    INSTRUCTIONS:
    1. **Be Natural & Conversational**: Avoid sounding robotic. Use connecting phrases. You can say "Sure, here's what I found..." or "Based on the guidelines...".
    2. **Handle Greetings**: If the user says "Hi", "Hello", or "Who are you?", respond naturally without looking for a policy document. (e.g., "Hello! I'm i-Patuh, your compliance assistant. How can I help you check the regulations today?").
    3. **Use the Context**: When asked about specific topics (e.g., Cloud, AML, e-KYC), base your answers STRICTLY on the "CONTEXT DOCUMENTS" provided below.
    4. **Cite Naturally**: You must cite your sources, but do it naturally within the flow or at the end of the relevant sentence. Use the format [[id]]. 
       - Example: "According to the RMiT guidelines, multi-factor authentication is mandatory for privileged access [[BNM-RMiT-2020]]."
    5. **Highlight Conflicts**: If you spot conflicting information between documents, point it out helpfully.
    6. **Formatting**: Use Markdown to make your text easy to read (bolding key terms, using bullet points).

    CONTEXT DOCUMENTS:
    ${contextString}
  `;

  try {
    // Check if the query is a simple greeting to avoid wasting tokens or getting weird RAG responses
    const lowerQuery = query.toLowerCase().trim();
    if (['hi', 'hello', 'hey', 'good morning', 'test'].includes(lowerQuery)) {
      return "Hello! I am i-Patuh, your AI-powered compliance research assistant. I can help you navigate BNM regulations, internal policies, and audit guidelines. What would you like to search for today?";
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
        temperature: 0.7, // Higher temperature for more natural, fluid language
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time. Could you please rephrase your question?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered a technical issue while analyzing the documents. Please try again in a moment.";
  }
};