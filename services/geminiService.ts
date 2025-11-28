import { GoogleGenAI } from "@google/genai";
import { Resolution, AspectRatio, ReferenceAsset } from '../types';

// Helper to create a new AI instance. 
// IMPORTANT: Needs to be created just before calling to ensure latest API key if selected via UI.
const createAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerateSceneParams {
  prompt: string;
  assets: ReferenceAsset[];
  resolution: Resolution;
  aspectRatio: AspectRatio;
  mode: string;
}

export const generateScene = async (params: GenerateSceneParams): Promise<string> => {
  const { prompt, assets, resolution, aspectRatio, mode } = params;

  const ai = createAI();
  const model = 'gemini-3-pro-image-preview';

  // Construct parts for the model
  const parts: any[] = [];

  // Add reference images to the prompt context
  // Sort so Main is first, generally good practice for "primary" reference
  const sortedAssets = [...assets].sort((a, b) => (a.type === 'main' ? -1 : 1));

  sortedAssets.forEach(asset => {
    parts.push({
      inlineData: {
        data: asset.data,
        mimeType: asset.mimeType
      }
    });
  });

  // Aspect Ratio Mapping
  let apiAspectRatio = "16:9";
  let ratioPrompt = "";

  switch (aspectRatio) {
    case AspectRatio.ANAMORPHIC: // 2.39:1
      apiAspectRatio = "16:9";
      ratioPrompt = "Anamorphic 2.39:1 aspect ratio, wide cinematic shot with black bars";
      break;
    case AspectRatio.WIDESCREEN: // 1.85:1
      apiAspectRatio = "16:9";
      ratioPrompt = "Widescreen 1.85:1 aspect ratio, cinematic film look";
      break;
    case AspectRatio.HD: // 16:9
      apiAspectRatio = "16:9";
      break;
    case AspectRatio.PORTRAIT: // 9:16
      apiAspectRatio = "9:16";
      break;
    case AspectRatio.SQUARE: // 1:1
      apiAspectRatio = "1:1";
      break;
    default:
      apiAspectRatio = "16:9";
  }

  // Enhanced Prompt Engineering for Character-Scene Fusion
  const hasMainAsset = assets.some(a => a.type === 'main');
  
  let finalPrompt = `TASK: Generate a high-fidelity cinematic storyboard frame.

CORE STYLE & ATMOSPHERE:
"${mode}"
- The image must embody the visual language, color grading, and mood of this genre.

SCENE DESCRIPTION:
"${prompt}"

VISUAL FUSION INSTRUCTIONS:
${hasMainAsset ? '1. CHARACTER INTEGRATION: You are provided with a reference image. Use this character strictly as the "Main Subject". Preserve their facial identity, build, and key costume details.' : ''}
${hasMainAsset ? `2. SCENE BLENDING: Place this character naturally into the "${mode}" scene described above. Ensure the lighting on the character matches the environment (e.g., shadows, reflections, color cast).` : '1. VISUALIZATION: Visualize the scene with high cinematic fidelity.'}
${hasMainAsset ? '3.' : '2.'} CAMERA & COMPOSITION: ${ratioPrompt}. Use professional cinematography techniques (depth of field, rule of thirds).

OUTPUT QUALITY:
Photorealistic, 8k render, highly detailed textures.`;

  parts.push({ text: finalPrompt });

  // Image Size mapping
  const imageSize = resolution; 

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: apiAspectRatio,
          imageSize: imageSize,
        },
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data returned from Gemini.");

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};