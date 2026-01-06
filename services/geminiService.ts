
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MINECRAFT_PROMPT = `
Transform the subject(s) from the uploaded image into a full-body Minecraft character model (voxel/block style).

STYLE & AESTHETIC:
- Match the official Minecraft game art style strictly.
- Blocky 3D voxel geometry, low-resolution pixel art textures.
- Standard in-game lighting, distinct cubic proportions.
- AVOID: Smooth 3D modeling, high-resolution textures, realistic rendering, curved lines.

SUBJECT DETAILS TO RETAIN:
- Strictly translate the subject's clothing pattern, hairstyle shape, and exact skin tone into the Minecraft block format.
- Facial features: Recreate expression using simple pixel art on the standard head block.
- Clothing pixelation: Convert all specific clothing items, logos, and patterns into detailed pixel textures.

CHARACTER INTEGRATION:
- Body proportions: Standard Minecraft proportions (Steve/Alex type).
- Multi-subject: If multiple people are present, transform all into separate standing characters.

OUTPUT REQUIREMENTS:
- Full-body view, head-to-toe fully visible character.
- Isometric or slight perspective view to show depth.
- Background: Transparent background only.
- Render Quality: Crisp pixel edges, looking exactly like a screenshot of a character skin in-game.
`;

export const minecraftifyImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // Using gemini-2.5-flash-image for image generation tasks
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image.split(',')[1], // Remove the data:image/png;base64, prefix
            },
          },
          {
            text: MINECRAFT_PROMPT,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Iterate through candidates to find the image part
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data returned from Gemini.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate Minecraft character.");
  }
};
