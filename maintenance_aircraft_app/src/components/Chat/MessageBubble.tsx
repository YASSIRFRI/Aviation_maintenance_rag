import React from 'react';
import { cn } from '../../utils/cn';
import { Message } from '../../types';
import Badge from '../ui/Badge';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-4',
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-none'
        )}
      >
        {/* optional tags */}
        {message.tags && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.tags.aircraftModel && (
              <Badge variant="primary" size="sm">
                {message.tags.aircraftModel}
              </Badge>
            )}
            {message.tags.issueCategory && (
              <Badge variant="secondary" size="sm">
                {message.tags.issueCategory}
              </Badge>
            )}
          </div>
        )}

        {/* message text */}
        <div className="whitespace-pre-line break-words">{message.content}</div>

        {/* footer */}
        <div
          className={cn(
            'text-xs mt-2',
            isUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {message.processingTime && ` • ${message.processingTime}s`}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
