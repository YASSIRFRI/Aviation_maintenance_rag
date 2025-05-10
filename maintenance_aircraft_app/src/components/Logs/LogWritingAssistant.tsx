import React, { useEffect, useState } from 'react';
import { MaintenanceLog, IssueCategory } from '../../types'; // Ensure IssueCategory is imported if it's a specific type
import { generateLogSuggestion, validateMaintenanceLog } from '../../data/mockData';

interface LogWritingAssistantProps {
  draftLog?: Partial<MaintenanceLog>; // Made optional with default value
  onSuggestionSelect?: (suggestion: string) => void;
}

const LogWritingAssistant: React.FC<LogWritingAssistantProps> = ({ 
  draftLog = {}, // Default empty object
  onSuggestionSelect = () => {} // Default no-op function
}) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [validation, setValidation] = useState<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }>({ isValid: true, issues: [], suggestions: [] });

  useEffect(() => {
    // Generate suggestions only when all required fields are present and are strings
    if (draftLog.aircraftModel && typeof draftLog.aircraftModel === 'string' &&
        draftLog.category && typeof draftLog.category === 'string' &&
        draftLog.description && typeof draftLog.description === 'string') {
      const generatedSuggestion = generateLogSuggestion(
        draftLog.aircraftModel,
        draftLog.category,
        draftLog.description
      );
      setSuggestion(generatedSuggestion);
    } else {
      setSuggestion(''); // Clear suggestion if prerequisites aren't met
    }

    // Validate the log if it has the essential fields that validateMaintenanceLog uses
    if (
      draftLog.aircraftModel && typeof draftLog.aircraftModel === 'string' &&
      draftLog.category && typeof draftLog.category === 'string' &&
      draftLog.description && typeof draftLog.description === 'string' &&
      draftLog.action && typeof draftLog.action === 'string'
      // Add checks for other fields if validateMaintenanceLog strictly requires a full MaintenanceLog
      // and accesses more than these. For the provided mock, these seem to be the core ones.
    ) {
      // Even though draftLog is Partial, if we've checked the fields
      // validateMaintenanceLog uses, we can cast it here.
      // This assumes validateMaintenanceLog can gracefully handle a log
      // that has these specific fields but might be missing others.
      const validationResult = validateMaintenanceLog(draftLog as MaintenanceLog);
      setValidation(validationResult);
    } else {
      // Reset validation if not all required fields for validation are present
      setValidation({ isValid: true, issues: [], suggestions: [] });
    }
  }, [draftLog]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Writing Assistant</h2>
        
        {/* Validation feedback */}
        {draftLog.description && draftLog.action && ( // Keep this display condition simple or tie to validation state
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Log Quality Check</h3>
            <div className={`p-3 rounded-md text-sm ${validation.isValid ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}`}>
              {validation.isValid && validation.issues.length === 0 && validation.suggestions.length === 0 ? (
                <p>Your log entry looks good so far!</p>
              ) : (
                <>
                  {validation.issues.length > 0 && (
                    <>
                      <p className="font-medium">Issues found:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {validation.issues.map((issue, idx) => (
                          <li key={`issue-${idx}`}>{issue}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {validation.suggestions.length > 0 && (
                     <>
                      <p className="font-medium mt-2">Suggestions for improvement:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {validation.suggestions.map((tip, idx) => (
                          <li key={`suggestion-${idx}`}>{tip}</li>
                        ))}
                      </ul>
                    </>
                  )}
                   {validation.isValid && (validation.issues.length > 0 || validation.suggestions.length > 0) && (
                     <p className="mt-2">Log is valid but has suggestions.</p>
                   )}
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Generated suggestion */}
        {suggestion && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Suggested Action</h3>
            <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-md text-sm">
              <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800 dark:text-gray-200">{suggestion}</pre>
              <button
                onClick={() => onSuggestionSelect(suggestion)}
                className="mt-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600 py-1 px-3 rounded"
              >
                Use Suggestion
              </button>
            </div>
          </div>
        )}
        
        {/* If there's no suggestion yet, but user has started typing description */}
        {!suggestion && draftLog.aircraftModel && draftLog.category && draftLog.description && (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Generating suggestions...</p>
          </div>
        )}
        
        {/* Initial state or when not enough info for suggestions */}
        {!(draftLog.aircraftModel && draftLog.category && draftLog.description) && !suggestion &&(
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Enter aircraft model, category, and issue description to get assistance with your log entry.
          </p>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Reference Materials</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {draftLog.aircraftModel ? `${draftLog.aircraftModel} Maintenance Manual` : "Aircraft Maintenance Manual"}
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Troubleshooting Procedures
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Service Bulletins
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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