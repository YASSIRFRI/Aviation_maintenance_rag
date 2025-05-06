import React, { useState } from 'react';
import LogValidationForm, { ValidationResult } from '../components/Logs/LogValidationForm';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { mockMaintenanceLogs } from '../data/mockData';
import { MaintenanceLog } from '../types';

const ValidateLogs: React.FC = () => {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } | null>(null);
  
  const [selectedLog, setSelectedLog] = useState<MaintenanceLog | null>(null);
  
  const handleSelectLog = (log: MaintenanceLog) => {
    setSelectedLog(log);
    setValidationResult(null);
  };
  
  const handleValidate = (result: {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }) => {
    setValidationResult(result);
  };
  
  const getStatusColor = (status: MaintenanceLog['status']) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Flagged':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Validate Maintenance Logs</h1>
        <p className="text-gray-500 dark:text-gray-400">Review and validate technician maintenance logs</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title="Recent Logs">
            <div className="space-y-4">
              {mockMaintenanceLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedLog?.id === log.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => handleSelectLog(log)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{log.aircraftModel}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {log.date} • {log.technicianName}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-sm truncate">{log.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedLog ? (
            <Card 
              title={`Log Details - ${selectedLog.aircraftModel} (${selectedLog.tailNumber})`}
              description={`Technician: ${selectedLog.technicianName} • ${selectedLog.date}`}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Category</h4>
                  <Badge variant="secondary">{selectedLog.category}</Badge>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                  <p className="text-gray-900 dark:text-gray-100">{selectedLog.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Action Taken</h4>
                  <p className="text-gray-900 dark:text-gray-100">{selectedLog.action}</p>
                </div>
                
                {selectedLog.parts && selectedLog.parts.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Parts Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLog.parts.map((part, index) => (
                        <Badge key={index} variant="default" size="sm">
                          {part}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Time Spent</h4>
                  <p className="text-gray-900 dark:text-gray-100">
                    {Math.floor(selectedLog.timeSpent / 60)}h {selectedLog.timeSpent % 60}m
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    onClick={() => {
                      const result = {
                        isValid: selectedLog.status === 'Completed',
                        issues: selectedLog.status === 'Pending' || selectedLog.status === 'Flagged' 
                          ? ['Status is not marked as completed', 'Some required information may be missing'] 
                          : [],
                        suggestions: ['Ensure all technical references are included', 'Add specific measurements where applicable']
                      };
                      setValidationResult(result);
                    }}
                  >
                    Validate This Log
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <LogValidationForm onValidate={handleValidate} />
          )}
          
          <ValidationResult result={validationResult} />
        </div>
      </div>
    </div>
  );
};

export default ValidateLogs;