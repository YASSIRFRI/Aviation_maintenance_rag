import React, { useState } from 'react';
import { validateMaintenanceLog } from '../../data/mockData';
import { MaintenanceLog } from '../../types';

interface LogValidationFormProps {
  onValidate: (result: {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }) => void;
}

const LogValidationForm: React.FC<LogValidationFormProps> = ({ onValidate }) => {
  const [formData, setFormData] = useState<Partial<MaintenanceLog>>({
    date: new Date().toISOString().split('T')[0],
    status: 'Completed'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a mock ID for validation purposes
    const mockLog: MaintenanceLog = {
      id: 'temp-id',
      technicianId: 'tech-id',
      technicianName: 'Validator',
      timeSpent: Number(formData.timeSpent) || 0,
      ...formData
    } as MaintenanceLog;
    
    const result = validateMaintenanceLog(mockLog);
    onValidate(result);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Validate a Maintenance Log</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Enter the details of a maintenance log to validate its completeness and compliance with standards.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Aircraft Model
            </label>
            <select
              name="aircraftModel"
              value={formData.aircraftModel || ''}
              onChange={handleInputChange}
              className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-slate-700"
              required
            >
              <option value="">Select Model</option>
              <option value="Boeing 737">Boeing 737</option>
              <option value="Airbus A320">Airbus A320</option>
              <option value="Boeing 787">Boeing 787</option>
              <option value="Airbus A350">Airbus A350</option>
              <option value="Embraer E190">Embraer E190</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tail Number
            </label>
            <input
              type="text"
              name="tailNumber"
              value={formData.tailNumber || ''}
              onChange={handleInputChange}
              className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-slate-700"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-slate-700"
              required
            >
              <option value="">Select Category</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Hydraulics">Hydraulics</option>
              <option value="Avionics">Avionics</option>
              <option value="Environmental">Environmental</option>
              <option value="Structural">Structural</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status || ''}
              onChange={handleInputChange}
              className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-slate-700"
              required
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Flagged">Flagged</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={2}
            className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-slate-700"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Action Taken
          </label>
          <textarea
            name="action"
            value={formData.action || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-slate-700"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parts Used (comma separated)
            </label>
            <input
              type="text"
              name="parts"
              value={(formData.parts || []).join(', ')}
              onChange={(e) => {
                const parts = e.target.value ? e.target.value.split(',').map(p => p.trim()) : [];
                setFormData(prev => ({ ...prev, parts }));
              }}
              className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-slate-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Spent (minutes)
            </label>
            <input
              type="number"
              name="timeSpent"
              value={formData.timeSpent || ''}
              onChange={handleInputChange}
              className="w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-slate-700"
              required
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Validate Log
          </button>
        </div>
      </form>
    </div>
  );
};

export const ValidationResult: React.FC<{
  result: {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } | null;
}> = ({ result }) => {
  if (!result) return null;
  
  return (
    <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Validation Results</h2>
      
      <div className={`p-4 rounded-md ${
        result.isValid 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900' 
          : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900'
      }`}>
        <div className="flex">
          {result.isValid ? (
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${
              result.isValid 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-yellow-800 dark:text-yellow-200'
            }`}>
              {result.isValid ? 'Log entry is valid' : 'Log entry needs attention'}
            </h3>
          </div>
        </div>
      </div>
      
      {result.issues.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issues:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {result.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      {result.suggestions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Suggestions:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {result.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LogValidationForm;