
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const processTopperImage = async (
  base64Image: string,
  name: string,
  age: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    ROLE: World-class Cake Topper Designer.
    TASK: Transform the provided reference image into a NEW, ORGANIZED PRINTABLE SHEET.
    
    STRICT RULES:
    1. NEW LAYOUT: Do NOT keep the original composition. Create a new "Sheet of Parts" (Folha de Recorte).
    2. ISOLATION: Detect every character, banner, balloon, name, age, and tiny ornament.
    3. SPACING: Every element must be isolated and separated by at least 2cm of empty space. No elements can touch or overlap.
    4. PERSONALIZATION: 
       - Replace the name with "${name || 'Lázaro'}".
       - Replace the age/number with "${age || '37'}".
       - Use VIBRANT, saturated colors (Neon Pink, Electric Blue, Bright Gold).
       - Ensure the text has a thick, high-contrast outline to make manual cutting easy.
    5. BACKGROUND: Use a SOLID PURE WHITE (#FFFFFF) background. Do NOT use gradients, shadows, or fake checkerboards. I will remove this background programmatically to create a TRUE transparent PNG.
    6. OUTPUT: A single high-resolution image showing the organized sheet.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          { text: prompt },
        ],
      },
    });

    let imageUrl = '';
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("Não foi possível gerar a imagem processada.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Erro no processamento Gemini:", error);
    throw error;
  }
};
