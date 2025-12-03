import React from 'react';
import { HOLIDAYS } from '../../constants';
import { FormData, HolidayId } from '../../types';

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Step1Holiday: React.FC<Props> = ({ formData, setFormData }) => {
  const handleSelect = (id: HolidayId) => {
    const holiday = HOLIDAYS.find(h => h.id === id);
    setFormData(prev => ({
      ...prev,
      holidayId: id,
      message: holiday ? holiday.defaultMessage : prev.message,
      // Keep existing custom name if switching between other items, or clear it? 
      // Let's keep it to be safe, but conceptually it only matters if id === 'custom'
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-serif font-bold text-stone-800">Choose a Holiday or Occasion</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {HOLIDAYS.map((holiday) => (
          <button
            key={holiday.id}
            onClick={() => handleSelect(holiday.id)}
            className={`
              relative flex items-center p-4 rounded-xl border-2 transition-all duration-200
              ${formData.holidayId === holiday.id 
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500 shadow-md' 
                : 'border-stone-200 bg-white hover:border-primary-300 hover:bg-stone-50'
              }
            `}
          >
            <div className={`
              p-3 rounded-full mr-4 transition-colors
              ${formData.holidayId === holiday.id ? 'bg-primary-200 text-primary-800' : 'bg-stone-100 text-stone-500'}
            `}>
              {holiday.icon}
            </div>
            <div className="text-left">
              <div className="font-semibold text-stone-900">{holiday.name}</div>
              {holiday.subName && (
                <div className="text-sm text-stone-500">{holiday.subName}</div>
              )}
            </div>
            
            {formData.holidayId === holiday.id && (
              <div className="absolute top-4 right-4 w-3 h-3 bg-primary-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Input for Custom Holiday */}
      {formData.holidayId === 'custom' && (
        <div className="mt-4 p-4 bg-stone-100 rounded-xl border border-stone-200 animate-in fade-in slide-in-from-top-2">
          <label htmlFor="customName" className="block text-sm font-medium text-stone-700 mb-2">
            What is the occasion? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customName"
            value={formData.customHolidayName || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, customHolidayName: e.target.value }))}
            placeholder="e.g. 1st Birthday, Graduation, Grand Opening, Promotion"
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors bg-white shadow-sm"
            autoFocus
          />
          <p className="text-xs text-stone-500 mt-2">
            The AI will design the card background based on this event name.
          </p>
        </div>
      )}
    </div>
  );
};

export default Step1Holiday;