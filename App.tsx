import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Loader2, Key, Info, Settings, Save, X, Check, Globe } from 'lucide-react';
import { FormData, StyleOption } from './types';
import { HOLIDAYS, DEFAULT_TEXT_CONFIG } from './constants';
import Step1Holiday from './components/Steps/Step1Holiday';
import Step2Style from './components/Steps/Step2Style';
import Step3Message from './components/Steps/Step3Message';
import Step4Result from './components/Steps/Step4Result';
import { generateGreetingCard, validateApiKey } from './services/geminiService';

// Final Build: Ready for Deployment
const INITIAL_DATA: FormData = {
  holidayId: 'new_year',
  styleOption: StyleOption.AI_THEME,
  referenceImageBase64: null,
  isStrictReference: false,
  frameId: 'none',
  resolution: '1K',
  autoTextConfig: false, // Default to manual control
  recipient: '',
  sender: '',
  message: HOLIDAYS[0].defaultMessage,
  // Initialize config for each field
  senderConfig: { ...DEFAULT_TEXT_CONFIG, fontSize: 'small' },
  recipientConfig: { ...DEFAULT_TEXT_CONFIG, fontSize: 'medium' },
  messageConfig: { ...DEFAULT_TEXT_CONFIG, fontSize: 'large' },
};

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeySet, setApiKeySet] = useState(false);

  // New State for Modals & API Settings
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [manualApiKey, setManualApiKey] = useState('');
  const [saveKeyLocally, setSaveKeyLocally] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  // Check API Key status on mount & Load from LocalStorage
  useEffect(() => {
    console.log("AI Season's Greetings App: Initialized & Ready");
    const checkKey = async () => {
      // 1. Check LocalStorage first
      const savedKey = localStorage.getItem('user_api_key');
      if (savedKey) {
        setManualApiKey(savedKey);
        setSaveKeyLocally(true);
        setApiKeySet(true);
      } else {
        // 2. Fallback to Env/Project selection
        try {
          if (window.aistudio) {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySet(hasKey);
          } else {
             setApiKeySet(!!process.env.API_KEY);
          }
        } catch (e) {
          console.error("Error checking API key status", e);
        }
      }
    };
    checkKey();
  }, []);

  const handleApiKeySelection = async () => {
    try {
        if(window.aistudio) {
            await window.aistudio.openSelectKey();
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (hasKey) {
              setApiKeySet(true);
              setError(null);
              // If project key is selected, clear manual key to avoid confusion
              setManualApiKey('');
              localStorage.removeItem('user_api_key');
            }
        }
    } catch (e) {
        console.error("Failed to select key", e);
        setError("Failed to select API Key. Please try again.");
    }
  }

  const handleTestConnection = async () => {
    if (!manualApiKey.trim()) return;
    setConnectionStatus('testing');
    const isValid = await validateApiKey(manualApiKey);
    if (isValid) {
      setConnectionStatus('success');
      setApiKeySet(true);
      setError(null);
      if (saveKeyLocally) {
        localStorage.setItem('user_api_key', manualApiKey);
      }
    } else {
      setConnectionStatus('failed');
    }
  };

  const handleToggleSaveKey = () => {
    const newState = !saveKeyLocally;
    setSaveKeyLocally(newState);
    if (!newState) {
      localStorage.removeItem('user_api_key');
    } else if (manualApiKey && connectionStatus === 'success') {
      localStorage.setItem('user_api_key', manualApiKey);
    }
  };

  const handleNext = () => {
    if (step === 1 && formData.holidayId === 'custom' && !formData.customHolidayName?.trim()) {
      setError("Please specify the occasion for the custom card.");
      return;
    }
    setError(null);

    if (step === 3) {
      handleGenerate();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!formData.sender.trim()) {
      setError("Please enter a sender name.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Pass the manual key if present, otherwise service falls back to env/project key
      const imageUrl = await generateGreetingCard(formData, undefined, manualApiKey || undefined);
      setGeneratedImage(imageUrl);
      setStep(4);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (updatedData: FormData) => {
    if (!generatedImage) return;

    setIsGenerating(true);
    setError(null);
    setFormData(updatedData);

    try {
      const newImageUrl = await generateGreetingCard(updatedData, generatedImage, manualApiKey || undefined);
      setGeneratedImage(newImageUrl);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleError = (err: any) => {
      console.error("Generation logic error:", err);
      const errorMessage = err.message || JSON.stringify(err);
      
      if (errorMessage.includes('403') || errorMessage.includes('permission') || errorMessage.includes('PERMISSION_DENIED')) {
        setError("Access Denied: The API Key does not have permission. Please check your billing or API settings.");
        setConnectionStatus('failed');
        // If it was a manual key, don't reset global apiKeySet immediately so they can just edit the field
        if (!manualApiKey) {
           setApiKeySet(false);
        }
        setShowSettings(true); // Auto open settings
      } else {
        setError(err.message || "An unexpected error occurred while generating the card.");
      }
  };

  const handleReset = () => {
    setStep(1);
    setGeneratedImage(null);
    setFormData(INITIAL_DATA);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Holiday formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step2Style formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step3Message formData={formData} setFormData={setFormData} />;
      case 4:
        return generatedImage ? (
          <Step4Result 
            imageUrl={generatedImage} 
            onReset={handleReset} 
            formData={formData} 
            onRefine={handleRefine}
            isRefining={isGenerating}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100 flex flex-col ${step === 4 ? 'md:max-w-5xl' : 'min-h-[600px]'} animate-in fade-in zoom-in-95 duration-500`}>
        
        {/* Header */}
        <div className="bg-primary-500 p-6 text-white relative">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold tracking-wide">AI Season's Greetings</h1>
            <p className="text-primary-100 text-sm mt-1">Create personalized holiday cards with magic</p>
          </div>
          
          {/* Header Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-3">
            <button 
              onClick={() => setShowAbout(true)}
              className="p-2 bg-primary-600/50 hover:bg-primary-600 rounded-full transition-colors text-white"
              title="About & How to Use"
            >
              <Info className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-full transition-colors text-white ${apiKeySet ? 'bg-primary-600/50 hover:bg-primary-600' : 'bg-red-500 hover:bg-red-600 animate-pulse'}`}
              title="API Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="bg-primary-50 px-6 py-4 flex justify-between items-center text-sm font-medium text-stone-500 border-b border-primary-100">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-700' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border ${step >= 1 ? 'bg-primary-600 border-primary-600 text-white' : 'border-stone-300'}`}>1</span>
              Holiday
            </div>
            <div className="w-8 h-px bg-stone-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary-700' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border ${step >= 2 ? 'bg-primary-600 border-primary-600 text-white' : 'border-stone-300'}`}>2</span>
              Style
            </div>
            <div className="w-8 h-px bg-stone-300"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary-700' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border ${step >= 3 ? 'bg-primary-600 border-primary-600 text-white' : 'border-stone-300'}`}>3</span>
              Message
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col relative">
            
          {/* Main API Warning in body (only if absolutely no key is detected) */}
          {!apiKeySet && !manualApiKey && !process.env.API_KEY && (
             <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                 <Key className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                 <div>
                     <p className="text-sm text-yellow-800 font-medium">Setup Required</p>
                     <p className="text-xs text-yellow-700 mt-1 mb-2">
                         To start creating cards, please configure your API Key in settings.
                     </p>
                     <button 
                        onClick={() => setShowSettings(true)}
                        className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-900 px-3 py-1 rounded-md transition-colors font-medium"
                     >
                         Open Settings
                     </button>
                 </div>
             </div>
          )}

          {isGenerating && step < 4 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-stone-800">Designing your card...</h3>
                <p className="text-stone-500 text-sm">Our AI artist is painting and writing your message.</p>
                <p className="text-stone-400 text-xs mt-2">This may take up to 20 seconds.</p>
              </div>
            </div>
          ) : (
             <div className="flex-1">
                 {error && (
                   <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex flex-col items-start gap-2 animate-in slide-in-from-top-2">
                     <div>
                        <span className="font-bold">Error:</span> {error}
                     </div>
                     <button 
                       onClick={() => setShowSettings(true)}
                       className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-xs font-semibold transition-colors"
                     >
                       Check Settings
                     </button>
                   </div>
                 )}
                 {renderStep()}
             </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isGenerating && step < 4 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${step === 1 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-200'}`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={step === 2 && formData.styleOption === StyleOption.REFERENCE && !formData.referenceImageBase64}
              className={`
                flex items-center px-6 py-2 rounded-lg font-medium shadow-md transition-all
                ${(step === 2 && formData.styleOption === StyleOption.REFERENCE && !formData.referenceImageBase64)
                  ? 'bg-stone-300 text-white cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                }
              `}
            >
              {step === 3 ? 'Create Card' : 'Next'}
              {step < 3 && <ChevronRight className="w-5 h-5 ml-1" />}
            </button>
          </div>
        )}
        
        {/* Developer Footer */}
        <div className="bg-stone-100 py-4 text-center border-t border-stone-200">
           <p className="text-xs text-stone-500 font-medium flex items-center justify-center gap-1.5">
             Developed by: 
             <a 
               href="https://naver.me/I55WtNIG" 
               target="_blank" 
               rel="noopener noreferrer"
               className="
                 font-extrabold text-sm
                 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800
                 drop-shadow-sm
                 hover:scale-105 transition-transform duration-200
               "
               title="Visit Shinwha AI Real Estate on Naver Map"
             >
               신화AI부동산
             </a>
           </p>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-primary-500 p-4 text-white flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg">About & How to Use</h3>
              <button onClick={() => setShowAbout(false)} className="hover:bg-primary-600 rounded-full p-1"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-sm text-stone-600 space-y-2">
                <p>Welcome to <strong>AI Season's Greetings</strong>! Create beautiful, personalized holiday cards instantly using advanced AI.</p>
                <h4 className="font-bold text-stone-800 mt-4">How it works:</h4>
                <ol className="list-decimal list-inside space-y-1 ml-1">
                  <li><strong>Select a Holiday:</strong> Choose from presets or enter a custom occasion.</li>
                  <li><strong>Choose Style:</strong> Use AI's automatic theme or upload your own photo reference.</li>
                  <li><strong>Customize:</strong> Enter your message, choose fonts, and select a frame.</li>
                  <li><strong>Download:</strong> Get your high-quality card instantly!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
             <div className="bg-stone-800 p-4 text-white flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg flex items-center gap-2"><Settings className="w-5 h-5"/> API Settings</h3>
              <button onClick={() => setShowSettings(false)} className="hover:bg-stone-700 rounded-full p-1"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 space-y-6">
               {/* Option A: Project Selection */}
               {window.aistudio && (
                 <div className="bg-primary-50 p-4 rounded-xl border border-primary-100">
                   <h4 className="text-sm font-bold text-primary-900 mb-2">Option 1: Select Google Cloud Project</h4>
                   <p className="text-xs text-stone-600 mb-3">Easiest method. Selects a key securely from your account.</p>
                   <button 
                     onClick={handleApiKeySelection}
                     className="w-full py-2 bg-white border border-primary-300 text-primary-700 hover:bg-primary-100 rounded-lg text-sm font-bold transition-colors shadow-sm"
                   >
                     Select Project Key
                   </button>
                 </div>
               )}

               {/* Option B: Manual Input */}
               <div>
                  <h4 className="text-sm font-bold text-stone-800 mb-2">Option 2: Manual API Key</h4>
                  <p className="text-xs text-stone-500 mb-2">Enter a key from AI Studio or Google Cloud.</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-4 w-4 text-stone-400" />
                    </div>
                    <input
                      type="password"
                      value={manualApiKey}
                      onChange={(e) => {
                         setManualApiKey(e.target.value);
                         setConnectionStatus('idle');
                      }}
                      placeholder="Enter API Key (AIza...)"
                      className="pl-10 w-full px-4 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  
                  {/* Test & Save Controls */}
                  <div className="flex items-center justify-between mt-3">
                     <div className="flex items-center gap-2">
                        <button
                          onClick={handleToggleSaveKey}
                          className={`w-10 h-6 rounded-full p-1 transition-colors ${saveKeyLocally ? 'bg-green-500' : 'bg-stone-300'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${saveKeyLocally ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </button>
                        <span className="text-xs text-stone-600">Save to browser</span>
                     </div>

                     <button
                       onClick={handleTestConnection}
                       disabled={!manualApiKey || connectionStatus === 'testing'}
                       className={`
                         flex items-center px-4 py-1.5 rounded-lg text-xs font-bold transition-colors
                         ${connectionStatus === 'success' 
                           ? 'bg-green-100 text-green-700 border border-green-200' 
                           : connectionStatus === 'failed'
                           ? 'bg-red-100 text-red-700 border border-red-200'
                           : 'bg-stone-800 text-white hover:bg-black'
                         }
                       `}
                     >
                       {connectionStatus === 'testing' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                       {connectionStatus === 'success' && <Check className="w-3 h-3 mr-1" />}
                       {connectionStatus === 'failed' && <X className="w-3 h-3 mr-1" />}
                       {connectionStatus === 'idle' && 'Test Connection'}
                       {connectionStatus === 'testing' && 'Testing...'}
                       {connectionStatus === 'success' && 'Verified'}
                       {connectionStatus === 'failed' && 'Failed'}
                     </button>
                  </div>
                  
                  {connectionStatus === 'failed' && (
                    <p className="text-xs text-red-500 mt-2">Could not connect. Check key or billing status.</p>
                  )}

                  {/* SUCCESS ACTION BUTTON */}
                  {connectionStatus === 'success' && (
                     <button 
                       onClick={() => setShowSettings(false)}
                       className="w-full mt-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-md transition-all animate-in fade-in slide-in-from-top-2 flex items-center justify-center"
                     >
                       Complete Setup <Check className="w-4 h-4 ml-2" />
                     </button>
                  )}
               </div>

               <div className="pt-4 border-t border-stone-100 text-center">
                 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="inline-flex items-center text-xs text-primary-600 hover:underline">
                   <Globe className="w-3 h-3 mr-1" />
                   Get an API Key
                 </a>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;