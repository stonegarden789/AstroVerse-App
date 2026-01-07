
import React, { useState, useEffect } from 'react';
import type { BirthData, User } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';

interface BirthDataFormProps {
  onSubmit: (data: BirthData, shouldSave: boolean) => void;
  initialData?: User | null;
}

export const BirthDataForm: React.FC<BirthDataFormProps> = ({ onSubmit, initialData }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [shouldSave, setShouldSave] = useState(false);
  const [errors, setErrors] = useState({ date: false, time: false, location: false });
  const { language } = useLanguage();
  const t = translations[language];

  // Pre-fill data if available from the logged-in user
  useEffect(() => {
      if (initialData?.birthDate) {
          setDate(initialData.birthDate);
          setShouldSave(true); // Assuming if they have data, they want to keep saving it
      }
      if (initialData?.birthTime) setTime(initialData.birthTime);
      if (initialData?.birthLocation) setLocation(initialData.birthLocation);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
        date: !date,
        time: !time,
        location: !location,
    };
    setErrors(newErrors);

    if (!newErrors.date && !newErrors.time && !newErrors.location) {
        onSubmit({ date, time, location }, shouldSave);
    }
  };

  const getButtonText = () => {
      if (shouldSave) return t.form.saveAndGenerate;
      return t.form.generateOnly;
  }

  return (
    <div className="card-base p-6 sm:p-8 rounded-2xl w-full">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">{t.form.dateLabel}</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={`w-full bg-gray-900/50 border ${errors.date ? 'border-red-500' : 'border-violet-800/50'} text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all placeholder-gray-500`}
            />
            {errors.date && <p className="text-red-400 text-xs mt-1">{t.form.required}</p>}
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">{t.form.timeLabel}</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className={`w-full bg-gray-900/50 border ${errors.time ? 'border-red-500' : 'border-violet-800/50'} text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all placeholder-gray-500`}
            />
             {errors.time && <p className="text-red-400 text-xs mt-1">{t.form.required}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">{t.form.locationLabel}</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder={t.form.locationPlaceholder}
            className={`w-full bg-gray-900/50 border ${errors.location ? 'border-red-500' : 'border-violet-800/50'} text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all placeholder-gray-500`}
          />
           {errors.location && <p className="text-red-400 text-xs mt-1">{t.form.required}</p>}
        </div>

        {/* Persistence Checkbox */}
        <div className="flex items-center space-x-3 bg-black/20 p-3 rounded-lg border border-white/5 hover:border-violet-500/30 transition-colors">
            <input 
                type="checkbox" 
                id="saveData"
                checked={shouldSave}
                onChange={(e) => setShouldSave(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
            <label htmlFor="saveData" className="text-sm text-gray-300 cursor-pointer select-none">
                {t.form.saveDataLabel}
            </label>
        </div>

        <button
          type="submit"
          className="w-full button-primary py-3 transition-transform active:scale-95"
        >
          {getButtonText()}
        </button>
      </form>
    </div>
  );
};
