import React, { useState } from 'react';
import { Download, RefreshCcw, Wand2, ArrowRight } from 'lucide-react';
import { FormData, TextConfig } from '../../types';
import TextConfigControl from '../TextConfigControl';

interface Props {
  imageUrl: string;
  onReset: () => void;
  onRefine: (updatedData: FormData) => void;
  formData: FormData;
  isRefining?: boolean;
}

const Step4Result: React.FC<Props> = ({ imageUrl, onReset, onRefine, formData, isRefining }) => {
  const [localData, setLocalData] = useState<FormData>(formData);

  const handleDownload = () => {
    const byteString = atob(imageUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `Greeting_Card_${localData.holidayId}_${dateStr}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleConfigChange = (field: 'senderConfig' | 'recipientConfig' | 'messageConfig', newConfig: TextConfig) => {
    setLocalData(prev => ({
      ...prev,
      [field]: newConfig
    }));
  };

  const handleUpdate = () => {
    onRefine(localData);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Column: Image Display */}
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-xl font-serif font-bold text-stone-800 mb-4 md:hidden">Your Card is Ready!</h2>
        
        <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white w-full max-w-sm">
          <img src={imageUrl} alt="Generated Greeting Card" className="w-full h-auto block" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 w-full max-w-sm">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-md transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </button>
          
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-white text-stone-700 border border-stone-300 rounded-lg font-medium hover:bg-stone-50 shadow-sm transition-colors"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            New Card
          </button>
        </div>
      </div>

      {/* Right Column: Edit Controls */}
      <div className="flex-1 bg-stone-50 p-6 rounded-xl border border-stone-200 overflow-y-auto max-h-[800px]">
        <div className="flex items-center gap-2 mb-4 text-primary-800 border-b border-primary-200 pb-2">
          <Wand2 className="w-5 h-5" />
          <h3 className="font-bold font-serif text-lg">Make Adjustments</h3>
        </div>
        
        <p className="text-sm text-stone-600 mb-6">
          Adjust details and typography below to refine the card.
        </p>

        <div className="space-y-6">
          {/* General Instruction */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Layout & Visual Instructions</label>
            <textarea
              name="refinementInstruction"
              value={localData.refinementInstruction || ''}
              onChange={handleChange}
              placeholder="e.g. Move text to the top right, make the background brighter..."
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          <hr className="border-stone-200" />

          {/* Message Control */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Message</label>
            <textarea
              name="message"
              value={localData.message}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <TextConfigControl 
              label="Message Style"
              config={localData.messageConfig} 
              onChange={(c) => handleConfigChange('messageConfig', c)} 
            />
          </div>

          {/* Recipient Control */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Recipient</label>
            <input
              type="text"
              name="recipient"
              value={localData.recipient}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <TextConfigControl 
              label="Recipient Style"
              config={localData.recipientConfig} 
              onChange={(c) => handleConfigChange('recipientConfig', c)} 
            />
          </div>

          {/* Sender Control */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Sender</label>
            <input
              type="text"
              name="sender"
              value={localData.sender}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <TextConfigControl 
              label="Sender Style"
              config={localData.senderConfig} 
              onChange={(c) => handleConfigChange('senderConfig', c)} 
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={isRefining}
            className={`
              w-full mt-4 flex items-center justify-center px-4 py-3 rounded-lg font-medium shadow-sm transition-all
              ${isRefining 
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed' 
                : 'bg-stone-800 text-white hover:bg-black'
              }
            `}
          >
            {isRefining ? 'Refining...' : 'Update Card'}
            {!isRefining && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4Result;