import React, { useState } from 'react';
import LogWritingAssistant from '../components/Logs/LogWritingAssistant';
import { MaintenanceLog } from '../types';

const LogWriting: React.FC = () => {
  const [draftLog, setDraftLog] = useState<Partial<MaintenanceLog>>({
    date: new Date().toISOString().split('T')[0],
    technicianId: 'tech123',
    technicianName: 'Alex Rodriguez',
    status: 'Pending'
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Log Writing Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400">Get AI assistance to create comprehensive maintenance logs</p>
      </div>
      
      <LogWritingAssistant 
        draftLog={draftLog}
        onSuggestionSelect={(suggestion) => {
          setDraftLog(prev => ({ ...prev, action: suggestion }));
        }}
      />
    </div>
  );
};

export default LogWriting;