import { GoogleGenAI } from "@google/genai";
import { FormData, TextConfig } from "../types";
import { HOLIDAYS, FRAMES, FONT_OPTIONS } from "../constants";

// Helper to get the API key via the window.aistudio interface
export const ensureApiKey = async (): Promise<boolean> => {
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Assume success after dialog close logic as per strict rules
      return true;
    }
    return true;
  }
  // Fallback if not running in that specific environment
  return !!process.env.API_KEY;
};

// New: Validate API Key by making a lightweight call
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use a lightweight model just to check auth
    await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Test',
    });
    return true;
  } catch (error) {
    console.error("API Key Validation Failed:", error);
    return false;
  }
};

// Helper to format text instructions
const formatTextPrompt = (text: string, config: TextConfig, label: string, useAutoConfig: boolean): string => {
    if (!text) return "";
    
    if (useAutoConfig) {
      return `${label}: "${text}"`;
    }

    const fontOption = FONT_OPTIONS.find(f => f.id === config.fontFamily);
    const fontDesc = fontOption ? fontOption.promptDesc : config.fontFamily;
    
    const styleDetails = [
        `Font Style: ${fontDesc}`,
        `Color: ${config.color}`,
        `Size: ${config.fontSize}`,
        config.isBold ? 'Weight: Bold' : '',
        config.isItalic ? 'Style: Italic' : ''
    ].filter(Boolean).join(", ");

    return `${label}: "${text}" [Typography: ${styleDetails}]`;
};

export const generateGreetingCard = async (formData: FormData, previousImageBase64?: string, overriddenApiKey?: string): Promise<string> => {
  
  let apiKey = overriddenApiKey;

  // 1. If no manual key, try to ensure/get environment key
  if (!apiKey) {
    await ensureApiKey();
    apiKey = process.env.API_KEY;
  }

  // 2. Validate Key Availability
  if (!apiKey) {
    throw new Error("API Key is missing. Please set up your API key in Settings.");
  }

  // 3. Initialize Client
  const ai = new GoogleGenAI({ apiKey });

  // 4. Construct Prompt Logic
  const holiday = HOLIDAYS.find((h) => h.id === formData.holidayId);
  const frame = FRAMES.find((f) => f.id === formData.frameId);
  
  let atmosphere = holiday?.promptAtmosphere || "Festive and elegant atmosphere";
  
  // Custom Holiday Override
  if (formData.holidayId === 'custom' && formData.customHolidayName) {
    atmosphere = `A celebratory atmosphere specifically designed for '${formData.customHolidayName}'. Visual elements, colors, and lighting that perfectly represent '${formData.customHolidayName}'. High quality, elegant, aesthetically pleasing.`;
  }

  // Strict Reference Mode Logic:
  if (formData.styleOption === 'REFERENCE' && formData.isStrictReference) {
    atmosphere = `STRICTLY follow the visual style, composition, lighting, and color palette of the provided reference image. Do not add new artistic interpretations or change the mood. The goal is to keep the original look of the reference image as closely as possible, serving effectively as a canvas for the text.`;
  }

  // Frame Logic
  let frameInstruction = "";
  if (frame && frame.id !== 'none') {
    frameInstruction = `Design Element: The card must have a ${frame.promptDescription} perfectly centered.`;
  }

  // Text Rendering Logic
  const messagePrompt = formatTextPrompt(formData.message, formData.messageConfig, "Main Message", formData.autoTextConfig);
  const senderPrompt = formatTextPrompt(`From ${formData.sender}`, formData.senderConfig, "Sender", formData.autoTextConfig);
  const recipientPrompt = formData.recipient ? formatTextPrompt(`To ${formData.recipient}`, formData.recipientConfig, "Recipient", formData.autoTextConfig) : "";

  let typographyInstruction = "";
  if (formData.autoTextConfig) {
    typographyInstruction = `
      TYPOGRAPHY RULES:
      - Automatically select the most aesthetic fonts, colors, and sizes that match the background and holiday atmosphere.
      - Ensure high contrast and readability.
      - FOR KOREAN TEXT (Hangul): Use high-quality Korean font styles (e.g., Serif/Myeongjo for elegance, Sans/Gothic for modern, Brush/Gungseo for traditional).
      - FOR ENGLISH TEXT: Use matching fonts.
      - Layout the text perfectly centered and balanced.
    `;
  } else {
    typographyInstruction = `
      TYPOGRAPHY RULES:
      - Strictly follow the specific font, color, and size instructions provided for each text field.
      - Layout the text elegantly on the card.
    `;
  }

  const textInstructions = `
    ${typographyInstruction}
    1. ${messagePrompt} (Center this prominently)
    2. ${recipientPrompt} (Place appropriately, typically above message)
    3. ${senderPrompt} (Place at bottom)
  `;

  const basePrompt = `
    Generate a high-quality greeting card image.
    Style & Atmosphere: ${atmosphere}.
    ${frameInstruction}
    Visual Quality: Cinematic lighting, detailed texture, 8k resolution, professional photography style.
    ${textInstructions}
    Ensure the text is spelled correctly, uses the requested font styles, and is integrated naturally into the image composition.
  `;

  // 5. Prepare Parts
  const parts: any[] = [];

  // EDIT MODE: If we are refining an existing image
  if (previousImageBase64) {
    const base64Data = previousImageBase64.split(',')[1];
    
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: 'image/png',
      }
    });

    const editInstruction = formData.refinementInstruction 
      ? `Specific Edit Instruction: ${formData.refinementInstruction}` 
      : "Improve the composition and text visibility.";

    const editPrompt = `
      Act as a professional photo editor and graphic designer.
      I have provided an image of a greeting card. Please regenerate this card with the following adjustments:
      
      ${editInstruction}
      
      Strictly maintain the text content and typography as follows:
      ${textInstructions}
      
      Maintain the original style, lighting, and atmosphere of the input image unless explicitly told to change it.
      Ensure the text is legible and beautiful.
    `;
    
    parts.push({ text: editPrompt });

  } else if (formData.styleOption === 'REFERENCE' && formData.referenceImageBase64) {
    // REFERENCE MODE (Initial Generation)
    const base64Data = formData.referenceImageBase64.split(',')[1];
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: 'image/png',
      }
    });
    
    let referenceInstruction = "Maintain the composition and color grading of the provided reference image, but adapt it to the requested holiday theme.";
    if (formData.isStrictReference) {
      referenceInstruction = "USE THE IMAGE EXACTLY AS IS. Do not alter the composition or style. Just add the requested text and frame.";
    }

    parts.push({
      text: `${basePrompt} \n ${referenceInstruction}`
    });
  } else {
    // TEXT-ONLY MODE (Initial Generation)
    parts.push({ text: basePrompt });
  }

  // 6. Call API
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", // Card aspect ratio
          imageSize: formData.resolution || '1K',
        }
      }
    });

    // 7. Extract Image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");
  } catch (error: any) {
    console.error("Generation failed:", error);
    throw error;
  }
};