import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquareText } from 'lucide-react';
import Card from '../components/ui/Card';
import MessageBubble from '../components/Chat/MessageBubble';
import ChatInput from '../components/Chat/ChatInput';
import { Message, AircraftModel, IssueCategory } from '../types';

const API_URL = 'http://localhost:5000/api';

const GetAssistance: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Keeps a handle on *the very last* div so we can scroll into view */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* Always stick to the bottom when a new message arrives */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (
    content: string,
    tags: { aircraftModel?: AircraftModel; issueCategory?: IssueCategory }
  ) => {
    setError(null);

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      tags,
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/chat`, {
        message: content,
        aircraftModel: tags.aircraftModel,
        issueCategory: tags.issueCategory,
      });

      const newAssistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        processingTime: data.processingTime,
      };
      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (err) {
      setError('Failed to get response from the server. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            'I encountered an error while processing your request. Please try again or contact support.',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* page header */}
      <div>
        <h1 className="text-2xl font-bold">Maintenance Assistance</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Get expert guidance for aircraft maintenance issues
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* chat card */}
      <Card className="flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col text-center p-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
                <MessageSquareText
                  size={32}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <h3 className="text-xl font-medium mb-2">Maintenance Assistant</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Ask questions about maintenance procedures, troubleshooting or
                technical specifications. Add relevant tags for more accurate
                responses.
              </p>
            </div>
          ) : (
            <>
              {messages.map(m => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {/* typing dots */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg p-4 rounded-bl-none max-w-[80%]">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* anchor for auto-scroll */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* input bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </Card>
    </div>
  );
};

export default GetAssistance;
