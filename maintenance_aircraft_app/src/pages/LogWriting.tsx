import React from 'react';
import LogWritingAssistant from '../components/Logs/LogWritingAssistant';

const LogWriting: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Log Writing Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400">Get AI assistance to create comprehensive maintenance logs</p>
      </div>
      
      <LogWritingAssistant />
    </div>
  );
};

export default LogWriting;