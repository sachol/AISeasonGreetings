import React, { useRef } from 'react';
import { FormData, StyleOption } from '../../types';
import { Sparkles, Image as ImageIcon, Upload, ShieldCheck } from 'lucide-react';

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Step2Style: React.FC<Props> = ({ formData, setFormData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          referenceImageBase64: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-stone-800">Select Style</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option A: AI Theme */}
        <button
          onClick={() => setFormData(prev => ({ ...prev, styleOption: StyleOption.AI_THEME }))}
          className={`
            flex flex-col items-center p-6 rounded-xl border-2 transition-all
            ${formData.styleOption === StyleOption.AI_THEME 
              ? 'border-primary-500 bg-primary-50 shadow-md' 
              : 'border-stone-200 bg-white hover:bg-stone-50'
            }
          `}
        >
          <Sparkles className={`w-8 h-8 mb-3 ${formData.styleOption === StyleOption.AI_THEME ? 'text-primary-600' : 'text-stone-400'}`} />
          <h3 className="font-semibold text-lg">AI Recommended</h3>
          <p className="text-sm text-stone-500 text-center mt-2">
            Perfectly matched atmosphere for the selected holiday.
          </p>
        </button>

        {/* Option B: Reference */}
        <button
          onClick={() => setFormData(prev => ({ ...prev, styleOption: StyleOption.REFERENCE }))}
          className={`
            flex flex-col items-center p-6 rounded-xl border-2 transition-all
            ${formData.styleOption === StyleOption.REFERENCE
              ? 'border-primary-500 bg-primary-50 shadow-md' 
              : 'border-stone-200 bg-white hover:bg-stone-50'
            }
          `}
        >
          <ImageIcon className={`w-8 h-8 mb-3 ${formData.styleOption === StyleOption.REFERENCE ? 'text-primary-600' : 'text-stone-400'}`} />
          <h3 className="font-semibold text-lg">My Reference</h3>
          <p className="text-sm text-stone-500 text-center mt-2">
            Upload a photo to match its mood and lighting.
          </p>
        </button>
      </div>

      {/* Upload Section - Only visible if Reference is selected */}
      {formData.styleOption === StyleOption.REFERENCE && (
        <div className="mt-6 p-6 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50 flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4 duration-300">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {formData.referenceImageBase64 ? (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="relative group w-full max-w-xs">
                <img 
                  src={formData.referenceImageBase64} 
                  alt="Reference" 
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg font-medium"
                >
                  Change Image
                </button>
              </div>

              {/* Strict Reference Checkbox */}
              <div className="w-full max-w-xs bg-white p-3 rounded-lg border border-stone-200 shadow-sm flex items-start gap-3">
                 <div className="flex items-center h-5 mt-0.5">
                   <input
                     id="strict-mode"
                     type="checkbox"
                     checked={formData.isStrictReference}
                     onChange={(e) => setFormData(prev => ({ ...prev, isStrictReference: e.target.checked }))}
                     className="w-4 h-4 text-primary-600 border-stone-300 rounded focus:ring-primary-500"
                   />
                 </div>
                 <div className="text-sm">
                   <label htmlFor="strict-mode" className="font-medium text-stone-900 block cursor-pointer">
                     Pure Reference Mode
                   </label>
                   <p className="text-stone-500 text-xs mt-1">
                     Check this to use your image's style exactly as is, minimizing AI creativity.
                   </p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-stone-500" />
              </div>
              <p className="text-stone-700 font-medium mb-1">Upload reference image</p>
              <p className="text-xs text-stone-400 mb-4">JPG, PNG up to 5MB</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-medium hover:bg-stone-50 text-stone-700 shadow-sm"
              >
                Select File
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step2Style;