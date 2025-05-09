import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import TagSelector from './TagSelector';
import { AircraftModel, IssueCategory } from '../../types';

interface ChatInputProps {
  onSendMessage: (content: string, tags: { aircraftModel?: AircraftModel; issueCategory?: IssueCategory }) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [selectedAircraftModel, setSelectedAircraftModel] = useState<AircraftModel | null>(null);
  const [selectedIssueCategory, setSelectedIssueCategory] = useState<IssueCategory | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const tags: { aircraftModel?: AircraftModel; issueCategory?: IssueCategory } = {};
      if (selectedAircraftModel) {
        tags.aircraftModel = selectedAircraftModel;
      }
      if (selectedIssueCategory) {
        tags.issueCategory = selectedIssueCategory;
      }
      onSendMessage(message, tags);
      setMessage('');
      // Keep tags selected for next message
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-2">
          <button
            type="button"
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-md mr-2"
            onClick={() => setShowTagSelector(!showTagSelector)}
          >
            {showTagSelector ? 'Hide tags' : 'Add tags'}
          </button>
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedAircraftModel && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {selectedAircraftModel}
                <button
                  type="button"
                  className="ml-1 text-blue-500 hover:text-blue-600"
                  onClick={() => setSelectedAircraftModel(null)}
                >
                  ×
                </button>
              </span>
            )}
            {selectedIssueCategory && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                {selectedIssueCategory}
                <button
                  type="button"
                  className="ml-1 text-teal-500 hover:text-teal-600"
                  onClick={() => setSelectedIssueCategory(null)}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
        
        {/* Tag selector is now shown ABOVE the text input, not replacing it */}
        {showTagSelector && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg max-h-96 overflow-y-auto">
            <TagSelector
              selectedAircraftModel={selectedAircraftModel}
              selectedIssueCategory={selectedIssueCategory}
              onSelectAircraftModel={setSelectedAircraftModel}
              onSelectIssueCategory={setSelectedIssueCategory}
            />
          </div>
        )}
        
        <div className="flex">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your maintenance question..."
            className="flex-1 resize-none"
            rows={3}
          />
          <Button
            type="submit"
            className="ml-2 self-end"
            disabled={!message.trim()}
            rightIcon={<Send size={16} />}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;