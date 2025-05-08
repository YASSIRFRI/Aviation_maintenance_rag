import React, { useEffect, useState } from 'react';
import { MaintenanceLog } from '../../types';
import { generateLogSuggestion, validateMaintenanceLog } from '../../data/mockData';

interface LogWritingAssistantProps {
  draftLog: MaintenanceLog;
  onSuggestionSelect: (suggestion: string) => void;
}

const LogWritingAssistant: React.FC<LogWritingAssistantProps> = ({ draftLog, onSuggestionSelect }) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [validation, setValidation] = useState<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }>({ isValid: true, issues: [], suggestions: [] });

  useEffect(() => {
    // Generate suggestions when aircraft model, category and description are available
    if (draftLog.aircraftModel && draftLog.category && draftLog.description) {
      const generatedSuggestion = generateLogSuggestion(
        draftLog.aircraftModel,
        draftLog.category,
        draftLog.description
      );
      setSuggestion(generatedSuggestion);
    }

    // Validate the log if it has essential fields
    if (draftLog.description && draftLog.action) {
      const validationResult = validateMaintenanceLog(draftLog);
      setValidation(validationResult);
    }
  }, [draftLog]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Writing Assistant</h2>
        
        {/* Validation feedback */}
        {draftLog.description && draftLog.action && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Log Quality Check</h3>
            <div className={`p-3 rounded-md ${validation.isValid ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
              {validation.isValid ? (
                <p>Your log entry looks good!</p>
              ) : (
                <>
                  <p className="font-medium">Suggestions for improvement:</p>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    {validation.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            
            {validation.suggestions.length > 0 && (
              <div className="mt-3 text-sm">
                <p className="font-medium">Tips:</p>
                <ul className="list-disc pl-5 mt-1">
                  {validation.suggestions.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Generated suggestion */}
        {suggestion && (
          <div>
            <h3 className="text-sm font-medium mb-2">Suggested Action</h3>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <pre className="whitespace-pre-wrap font-mono text-xs">{suggestion}</pre>
              <button
                onClick={() => onSuggestionSelect(suggestion)}
                className="mt-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded"
              >
                Use Suggestion
              </button>
            </div>
          </div>
        )}
        
        {/* If there's no suggestion yet */}
        {!suggestion && draftLog.description && (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <p className="mt-2 text-sm text-gray-500">Generating suggestions...</p>
          </div>
        )}
        
        {/* Initial state */}
        {!suggestion && !draftLog.description && (
          <p className="text-gray-500 text-sm">
            Enter aircraft details and issue description to get assistance with your log entry.
          </p>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Reference Materials</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {draftLog.aircraftModel ? `${draftLog.aircraftModel} Maintenance Manual` : "Aircraft Maintenance Manual"}
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Troubleshooting Procedures
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Service Bulletins
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {draftLog.category ? `${draftLog.category} Systems Guide` : "Systems Guides"}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LogWritingAssistant;