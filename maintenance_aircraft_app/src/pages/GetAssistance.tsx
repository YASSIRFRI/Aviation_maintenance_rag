import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareText } from 'lucide-react';
import Card from '../components/ui/Card';
import MessageBubble from '../components/Chat/MessageBubble';
import ChatInput from '../components/Chat/ChatInput';
import { Message, AircraftModel, IssueCategory } from '../types';
import { mockChatSessions } from '../data/mockData';

const GetAssistance: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockChatSessions[0].messages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (content: string, tags: { aircraftModel?: AircraftModel; issueCategory?: IssueCategory }) => {
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      tags,
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    // Simulate API response delay
    setTimeout(() => {
      // In a real app, this would call the API with RAG system to get a response
      const mockResponse = simulateModelResponse(content, tags);
      
      const newAssistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: mockResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
      setIsLoading(false);
    }, 2000);
  };
  
  const simulateModelResponse = (content: string, tags: { aircraftModel?: AircraftModel; issueCategory?: IssueCategory }) => {
    // This function simulates the response from the model based on the user's message and tags
    // In a real app, this would involve:
    // 1. Vector search in QuadrantCloud for relevant maintenance docs
    // 2. Passing those docs as context to the LLM (Llama 8b)
    // 3. Getting a response from the LLM
    
    // For demo purposes, return a canned response based on input
    if (content.toLowerCase().includes('engine') || content.toLowerCase().includes('vibration')) {
      return 'Based on the described symptoms, this could be related to an engine imbalance or loose mounting. I recommend checking:\n\n1. Engine mount torque values - refer to AMM section 71-00-00\n2. Fan blade integrity - look for any signs of damage or FOD\n3. Accessory gearbox attachments\n\nThe maintenance manual for this specific aircraft model provides a detailed troubleshooting procedure in section 71-00-05. Would you like me to walk you through those steps?';
    }
    
    if (content.toLowerCase().includes('hydraulic') || content.toLowerCase().includes('leak')) {
      return 'Hydraulic leaks can be challenging to locate precisely. Based on your description, I recommend:\n\n1. Perform a visual inspection of all hydraulic lines in the suspected area\n2. Check for blue/green staining which indicates previous leakage\n3. Clean the area and pressurize the system to observe for active leaks\n4. Use UV dye testing if the leak is difficult to locate\n\nFor this aircraft type, pay special attention to line connections and actuator seals - these are common failure points.';
    }
    
    if (content.toLowerCase().includes('avionics') || content.toLowerCase().includes('electrical')) {
      return 'For avionics issues, we should follow a systematic troubleshooting approach:\n\n1. Check for any error codes in the maintenance computer\n2. Verify power supply to the affected components\n3. Inspect wiring connectors for corrosion or damage\n4. Test continuity of suspect circuits\n\nThe fault you\'re describing is commonly associated with a ground connection issue or intermittent connector problem. The Aircraft Maintenance Manual section 24-00-00 has the detailed troubleshooting flowchart for this system.';
    }
    
    return 'I understand your maintenance issue. To provide more specific guidance, I\'ll need some additional information:\n\n1. Have you seen any warning lights or system messages?\n2. When did you first notice this issue?\n3. Is the problem intermittent or constant?\n4. Have any recent maintenance actions been performed on related systems?\n\nWith more details, I can provide targeted troubleshooting steps from the maintenance manual.';
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Maintenance Assistance</h1>
        <p className="text-gray-500 dark:text-gray-400">Get expert guidance for aircraft maintenance issues</p>
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