import React from 'react';
import { TextConfig, FontFamily, FontSize } from '../types';
import { FONT_OPTIONS, SIZE_OPTIONS, COLOR_OPTIONS } from '../constants';
import { Bold, Italic } from 'lucide-react';

interface Props {
  config: TextConfig;
  onChange: (newConfig: TextConfig) => void;
  label: string;
  disabled?: boolean;
}

const TextConfigControl: React.FC<Props> = ({ config, onChange, label, disabled = false }) => {
  
  const update = (key: keyof TextConfig, value: any) => {
    if (disabled) return;
    onChange({ ...config, [key]: value });
  };

  return (
    <div className={`bg-stone-50 p-3 rounded-lg border border-stone-200 mt-2 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">{label} Style</span>
        {disabled && <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">AI Auto</span>}
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* Font Family */}
        <select
          value={config.fontFamily}
          onChange={(e) => update('fontFamily', e.target.value as FontFamily)}
          className="w-full text-xs px-2 py-1.5 rounded border border-stone-300 bg-white focus:ring-1 focus:ring-primary-500 outline-none"
          disabled={disabled}
        >
          {FONT_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>

        {/* Size */}
        <select
          value={config.fontSize}
          onChange={(e) => update('fontSize', e.target.value as FontSize)}
          className="w-full text-xs px-2 py-1.5 rounded border border-stone-300 bg-white focus:ring-1 focus:ring-primary-500 outline-none"
          disabled={disabled}
        >
          {SIZE_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        {/* Color */}
        <select
          value={config.color}
          onChange={(e) => update('color', e.target.value)}
          className="flex-1 text-xs px-2 py-1.5 rounded border border-stone-300 bg-white focus:ring-1 focus:ring-primary-500 outline-none"
          disabled={disabled}
        >
          {COLOR_OPTIONS.map(opt => (
            <option key={opt.name} value={opt.value}>{opt.name}</option>
          ))}
        </select>

        {/* Toggles */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => update('isBold', !config.isBold)}
            className={`p-1.5 rounded border transition-colors ${config.isBold ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'}`}
            title="Bold"
            disabled={disabled}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => update('isItalic', !config.isItalic)}
            className={`p-1.5 rounded border transition-colors ${config.isItalic ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'}`}
            title="Italic"
            disabled={disabled}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextConfigControl;