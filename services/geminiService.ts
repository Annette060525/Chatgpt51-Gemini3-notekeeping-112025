import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export class GeminiService {
  private client: GoogleGenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
    }
  }

  setApiKey(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateResponse(
    model: string,
    messages: ChatMessage[],
    systemInstruction?: string,
    temperature: number = 0.7
  ): Promise<string> {
    if (!this.client) throw new Error("API Key not set");

    try {
      // Construct prompt from history
      // For simple demo purposes, we concat. In prod, use chat history API.
      const history = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const finalPrompt = `${systemInstruction ? `System: ${systemInstruction}\n` : ''}${history}\nmodel:`;

      const response = await this.client.models.generateContent({
        model: model, // e.g., 'gemini-2.5-flash'
        contents: finalPrompt,
        config: {
          temperature,
        }
      });
      
      return response.text || "No response generated.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return `Error: ${(error as Error).message}`;
    }
  }

  async analyzeAttachment(
    model: string,
    fileContent: string,
    question: string,
    systemInstruction?: string
  ): Promise<string> {
    if (!this.client) throw new Error("API Key not set");

    const prompt = `
      Context Document:
      ${fileContent.slice(0, 30000)} 
      
      Question: ${question}
    `;

    try {
      const response = await this.client.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });
      return response.text || "No analysis generated.";
    } catch (error) {
      return `Error: ${(error as Error).message}`;
    }
  }

  async processNotes(
    model: string,
    notes: string,
    task: 'markdown' | 'improve'
  ): Promise<string> {
    if (!this.client) throw new Error("API Key not set");

    let prompt = "";
    if (task === 'markdown') {
      prompt = `Convert the following raw notes into clean, structured Markdown. Use headers, bullet points, and code blocks where appropriate:\n\n${notes}`;
    } else {
      prompt = `Improve the formatting, clarity, and structure of the following Markdown content. Keep the original meaning but make it look professional:\n\n${notes}`;
    }

    try {
      const response = await this.client.models.generateContent({
        model: model,
        contents: prompt,
      });
      return response.text || "No changes generated.";
    } catch (error) {
      return `Error: ${(error as Error).message}`;
    }
  }
}

export const geminiService = new GeminiService();
