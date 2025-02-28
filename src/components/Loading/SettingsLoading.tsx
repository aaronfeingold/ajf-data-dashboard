import React from 'react';
import CitySkylineLoading from '@/components/Loading/CitySkylineLoading';

const SettingsLoading: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center py-8">
          <CitySkylineLoading animated={true} />
          <p className="mt-4 text-gray-300">Loading settings...</p>
        </div>

        <div className="space-y-6 mt-8">
          {/* Loading placeholders for settings sections */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-slate-700 rounded-lg p-6 space-y-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-blue-400 opacity-50 rounded-full"></div>
                <div>
                  <div className="h-5 w-40 bg-slate-700 rounded"></div>
                  <div className="h-3 w-64 bg-slate-700 mt-2 rounded"></div>
                </div>
              </div>
              <div className="pt-4 space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between py-3">
                    <div>
                      <div className="h-4 w-32 bg-slate-700 rounded"></div>
                      <div className="h-3 w-48 bg-slate-700 mt-2 rounded"></div>
                    </div>
                    <div className="w-8 h-4 bg-slate-700 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsLoading;
