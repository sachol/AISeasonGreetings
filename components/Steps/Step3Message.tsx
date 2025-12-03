import React from 'react';
import { FormData, FrameId, TextConfig, Resolution } from '../../types';
import { FRAMES, RESOLUTION_OPTIONS } from '../../constants';
import { Check, Gauge, Sparkles } from 'lucide-react';
import TextConfigControl from '../TextConfigControl';

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Step3Message: React.FC<Props> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfigChange = (field: 'senderConfig' | 'recipientConfig' | 'messageConfig', newConfig: TextConfig) => {
    setFormData(prev => ({
      ...prev,
      [field]: newConfig
    }));
  };

  const handleFrameSelect = (id: FrameId) => {
    setFormData(prev => ({ ...prev, frameId: id }));
  };

  const handleResolutionSelect = (res: Resolution) => {
    setFormData(prev => ({ ...prev, resolution: res }));
  };

  const toggleAutoConfig = () => {
    setFormData(prev => ({ ...prev, autoTextConfig: !prev.autoTextConfig }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-serif font-bold text-stone-800">Customize Message, Frame & Quality</h2>
      
      {/* Input Fields */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
        
        {/* Sender (Required) */}
        <div>
          <label htmlFor="sender" className="block text-sm font-medium text-stone-700 mb-1">
            From (Sender) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="sender"
            name="sender"
            value={formData.sender}
            onChange={handleChange}
            placeholder="e.g., Gildong Hong"
            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          />
          {formData.sender.trim() === '' && (
            <p className="text-xs text-red-400 mt-1">Sender name is required to generate the card.</p>
          )}
          <TextConfigControl 
            label="Sender Font" 
            config={formData.senderConfig} 
            onChange={(c) => handleConfigChange('senderConfig', c)}
            disabled={formData.autoTextConfig}
          />
        </div>

        {/* Recipient (Optional) */}
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-stone-700 mb-1">
            To (Recipient) <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="recipient"
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            placeholder="e.g., My Dear Friend"
            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          />
          <TextConfigControl 
            label="Recipient Font" 
            config={formData.recipientConfig} 
            onChange={(c) => handleConfigChange('recipientConfig', c)} 
            disabled={formData.autoTextConfig}
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">
            Greeting Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
          />
          <TextConfigControl 
            label="Message Font" 
            config={formData.messageConfig} 
            onChange={(c) => handleConfigChange('messageConfig', c)} 
            disabled={formData.autoTextConfig}
          />
        </div>
      </div>

      {/* AI Text Styling Toggle */}
      <div 
        onClick={toggleAutoConfig}
        className={`
          flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all
          ${formData.autoTextConfig 
            ? 'bg-gradient-to-r from-primary-600 to-primary-500 border-primary-600 text-white shadow-md' 
            : 'bg-white border-stone-200 hover:border-primary-300 text-stone-800'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${formData.autoTextConfig ? 'bg-white/20' : 'bg-stone-100'}`}>
            <Sparkles className={`w-6 h-6 ${formData.autoTextConfig ? 'text-white' : 'text-stone-500'}`} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">AI Auto-Styling</h3>
            <p className={`text-sm ${formData.autoTextConfig ? 'text-primary-100' : 'text-stone-500'}`}>
              Let AI choose the best fonts & colors (Supports Korean & English)
            </p>
          </div>
        </div>
        
        <div className={`
          w-14 h-7 rounded-full flex items-center transition-colors px-1
          ${formData.autoTextConfig ? 'bg-white/30' : 'bg-stone-200'}
        `}>
           <div className={`
             w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300
             ${formData.autoTextConfig ? 'translate-x-7 bg-white' : 'translate-x-0 bg-white'}
           `}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frame Selection */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <h3 className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide">Frame Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FRAMES.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => handleFrameSelect(frame.id)}
                  className={`
                    relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${formData.frameId === frame.id 
                      ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' 
                      : 'border-white bg-white hover:border-stone-300'
                    }
                  `}
                >
                  <div className={`mb-1 ${formData.frameId === frame.id ? 'text-primary-600' : 'text-stone-400'}`}>
                    {frame.icon}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${formData.frameId === frame.id ? 'text-primary-900' : 'text-stone-600'}`}>
                    {frame.name}
                  </span>
                  
                  {formData.frameId === frame.id && (
                    <div className="absolute top-1 right-1 text-primary-600">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Selection */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <h3 className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide flex items-center gap-2">
               <Gauge className="w-4 h-4" />
               Image Resolution
            </h3>
            <div className="flex flex-col gap-2">
              {RESOLUTION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleResolutionSelect(opt.id as Resolution)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left
                    ${formData.resolution === opt.id
                      ? 'border-primary-500 bg-white ring-1 ring-primary-500 shadow-sm' 
                      : 'border-transparent bg-white hover:border-stone-300'
                    }
                  `}
                >
                  <div>
                    <span className={`block font-bold text-sm ${formData.resolution === opt.id ? 'text-primary-900' : 'text-stone-700'}`}>
                      {opt.name}
                    </span>
                    <span className="text-xs text-stone-500">{opt.desc}</span>
                  </div>
                  <div className={`
                    w-4 h-4 rounded-full border flex items-center justify-center
                    ${formData.resolution === opt.id ? 'border-primary-500 bg-primary-500' : 'border-stone-300'}
                  `}>
                    {formData.resolution === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
      </div>

      <div className="bg-primary-50 p-4 rounded-lg flex items-start border border-primary-100">
        <div className="text-primary-800 text-sm">
          <span className="font-bold block mb-1">Summary:</span>
          <ul className="list-disc list-inside text-xs space-y-1 opacity-90">
             {formData.autoTextConfig ? (
               <li><strong>Text Styling:</strong> Managed by AI (Auto)</li>
             ) : (
               <li><strong>Text Styling:</strong> Manual Customization</li>
             )}
             <li><strong>Frame:</strong> {FRAMES.find(f => f.id === formData.frameId)?.name}</li>
             <li><strong>Quality:</strong> {formData.resolution} Resolution</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step3Message;