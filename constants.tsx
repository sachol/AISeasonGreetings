import React from 'react';
import { Sun, Moon, Leaf, Gift, Calendar, Star, Square, Box, Frame, Flower, Snowflake, Image as ImageIcon } from 'lucide-react';
import { Holiday, FrameOption, TextConfig } from './types';

export const HOLIDAYS: Holiday[] = [
  {
    id: 'new_year',
    name: 'New Year (1/1)',
    subName: '새해',
    icon: <Sun className="w-6 h-6" />,
    promptAtmosphere: "Sunrise over a calm ocean, hopeful atmosphere, bright warm lighting, minimalist elegant design, 8k resolution.",
    defaultMessage: "Happy New Year",
  },
  {
    id: 'lunar_new_year',
    name: 'Lunar New Year',
    subName: '구정 (Seollal)',
    icon: <Calendar className="w-6 h-6" />,
    promptAtmosphere: "Traditional Korean aesthetics, Hanok architecture, Bokjumeoni (lucky bag), Dancheong patterns, elegant calligraphy vibe, warm festive lighting, soft bokeh.",
    defaultMessage: "새해 복 많이 받으세요",
  },
  {
    id: 'daeboreum',
    name: 'Daeboreum',
    subName: '정월대보름',
    icon: <Moon className="w-6 h-6" />,
    promptAtmosphere: "Large bright full moon in a night sky, traditional Korean village at night, floating lanterns, mystical and serene atmosphere, dark blue and gold color palette.",
    defaultMessage: "소원 성취 하세요",
  },
  {
    id: 'chuseok',
    name: 'Chuseok',
    subName: '추석',
    icon: <Leaf className="w-6 h-6" />,
    promptAtmosphere: "Autumn leaves, persimmons, golden rice fields, full moon, traditional Korean harvest festival mood, warm golden hour lighting, rich oranges and browns.",
    defaultMessage: "풍요로운 한가위 되세요",
  },
  {
    id: 'christmas',
    name: 'Christmas',
    subName: '크리스마스',
    icon: <Gift className="w-6 h-6" />,
    promptAtmosphere: "Christmas tree with glowing lights, snow falling outside a window, cozy fireplace, red and gold ornaments, low-key warm lighting, magical bokeh.",
    defaultMessage: "Merry Christmas",
  },
  {
    id: 'custom',
    name: 'Custom / Other',
    subName: '직접 입력 (Birthday, etc.)',
    icon: <Star className="w-6 h-6" />,
    promptAtmosphere: "Celebratory atmosphere appropriate for the specific occasion.",
    defaultMessage: "Congratulations",
  },
];

export const FRAMES: FrameOption[] = [
  {
    id: 'none',
    name: 'No Frame',
    promptDescription: "No border, edge-to-edge image.",
    icon: <Square className="w-5 h-5 text-stone-400" />
  },
  {
    id: 'simple',
    name: 'Simple Gold',
    promptDescription: "A thin, elegant metallic gold line border around the edges.",
    icon: <Box className="w-5 h-5 text-yellow-600" />
  },
  {
    id: 'ornate',
    name: 'Ornate / Royal',
    promptDescription: "A luxurious, intricate vintage corner frame design with swirls and classical detailing.",
    icon: <Frame className="w-5 h-5 text-yellow-700" />
  },
  {
    id: 'floral',
    name: 'Floral',
    promptDescription: "A natural border made of soft flowers, leaves, and vines framing the image.",
    icon: <Flower className="w-5 h-5 text-pink-500" />
  },
  {
    id: 'festive',
    name: 'Festive',
    promptDescription: "A decorative border appropriate for the holiday (e.g. snowflakes for winter, clouds for new year).",
    icon: <Snowflake className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'polaroid',
    name: 'Polaroid Style',
    promptDescription: "A vintage instant photo style with a thick white border at the bottom.",
    icon: <ImageIcon className="w-5 h-5 text-stone-600" />
  },
];

// Updated Font Options to include Korean Style descriptions
export const FONT_OPTIONS = [
    { id: 'serif', name: 'Serif / Myeongjo (명조)', promptDesc: 'Elegant Serif or Korean Myeongjo style' },
    { id: 'sans', name: 'Sans / Gothic (고딕)', promptDesc: 'Modern Sans-serif or Korean Gothic style' },
    { id: 'brush', name: 'Brush / Gungseo (궁서)', promptDesc: 'Traditional Ink Brush or Korean Gungseo style' },
    { id: 'handwritten', name: 'Handwritten (손글씨)', promptDesc: 'Casual handwritten pen style' },
    { id: 'calligraphy', name: 'Calligraphy (캘리그라피)', promptDesc: 'Artistic fancy calligraphy' },
    { id: 'cursive', name: 'Cursive (필기체)', promptDesc: 'Flowing cursive script' },
] as const;

export const SIZE_OPTIONS = [
    { id: 'small', name: 'Small' },
    { id: 'medium', name: 'Medium' },
    { id: 'large', name: 'Large' },
    { id: 'huge', name: 'Huge' },
] as const;

export const COLOR_OPTIONS = [
    { name: 'Black', value: 'Black' },
    { name: 'White', value: 'White' },
    { name: 'Gold', value: 'Gold' },
    { name: 'Red', value: 'Dark Red' },
    { name: 'Navy', value: 'Navy Blue' },
    { name: 'Green', value: 'Dark Green' },
    { name: 'Brown', value: 'Dark Brown' },
] as const;

export const RESOLUTION_OPTIONS = [
  { id: '1K', name: '1K', desc: 'Standard' },
  { id: '2K', name: '2K', desc: 'High Quality' },
  { id: '4K', name: '4K', desc: 'Ultra HD' },
] as const;

export const DEFAULT_TEXT_CONFIG: TextConfig = {
    fontFamily: 'serif',
    color: 'Gold',
    fontSize: 'medium',
    isBold: false,
    isItalic: false
};