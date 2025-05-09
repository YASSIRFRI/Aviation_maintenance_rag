import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquareText } from 'lucide-react';
import Card from '../components/ui/Card';
import MessageBubble from '../components/Chat/MessageBubble';
import ChatInput from '../components/Chat/ChatInput';
import { Message, AircraftModel, IssueCategory } from '../types';

// Set the API URL - this should match your Flask server address
const API_URL = 'http://localhost:5000/api';

const GetAssistance: React.FC = () => {
  // Start with an empty messages array instead of mock data
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (content: string, tags: { aircraftModel?: AircraftModel; issueCategory?: IssueCategory }) => {
    // Reset any previous errors
    setError(null);
    
    // Add user message to chat
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
      console.log('Sending request to Flask API:', content);
      
      // Send request to Flask API
      const response = await axios.post(`${API_URL}/chat`, {
        message: content,
        aircraftModel: tags.aircraftModel,
        issueCategory: tags.issueCategory
      });
      
      console.log('Received response from Flask API:', response.data);
      
      // Add assistant message to chat
      const newAssistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        processingTime: response.data.processingTime,
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (err) {
      console.error('Error fetching response:', err);
      setError('Failed to get response from the server. Please try again.');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Maintenance Assistance</h1>
        <p className="text-gray-500 dark:text-gray-400">Get expert guidance for aircraft maintenance issues</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      
      <Card className="h-[calc(100vh-220px)] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center flex-col text-center p-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
                <MessageSquareText size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Maintenance Assistant</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Ask questions about maintenance procedures, troubleshooting, or technical specifications. Add relevant tags for more accurate responses.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg p-4 rounded-bl-none max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </Card>
    </div>
  );
};

export default GetAssistance;