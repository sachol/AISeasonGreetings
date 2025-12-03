import React from 'react';

export type HolidayId = 'new_year' | 'lunar_new_year' | 'daeboreum' | 'chuseok' | 'christmas' | 'custom';

export type FrameId = 'none' | 'simple' | 'ornate' | 'floral' | 'festive' | 'polaroid';

export enum StyleOption {
  AI_THEME = 'AI_THEME',
  REFERENCE = 'REFERENCE',
}

export type FontFamily = 'serif' | 'sans' | 'handwritten' | 'calligraphy' | 'cursive' | 'brush';
export type FontSize = 'small' | 'medium' | 'large' | 'huge';
export type Resolution = '1K' | '2K' | '4K';

export interface TextConfig {
  fontFamily: FontFamily;
  color: string;
  fontSize: FontSize;
  isBold: boolean;
  isItalic: boolean;
}

export interface Holiday {
  id: HolidayId;
  name: string;
  subName?: string;
  icon: React.ReactNode;
  promptAtmosphere: string;
  defaultMessage: string;
}

export interface FrameOption {
  id: FrameId;
  name: string;
  promptDescription: string;
  icon?: React.ReactNode;
}

export interface FormData {
  holidayId: HolidayId;
  customHolidayName?: string;
  styleOption: StyleOption;
  referenceImageBase64: string | null;
  isStrictReference: boolean;
  frameId: FrameId;
  resolution: Resolution;
  
  // New flag for AI Text Styling
  autoTextConfig: boolean;

  recipient: string;
  recipientConfig: TextConfig;

  sender: string;
  senderConfig: TextConfig;

  message: string;
  messageConfig: TextConfig;

  refinementInstruction?: string; 
}

// Augment window for AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}