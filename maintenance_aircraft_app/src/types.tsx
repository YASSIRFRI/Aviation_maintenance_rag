export interface User {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }
  
  export interface MaintenanceLog {
    id: string;
    date: string;
    aircraftModel: string;
    tailNumber: string;
    technicianId: string;
    technicianName: string;
    category: string;
    description: string;
    action: string;
    status: 'Pending' | 'Completed' | 'Flagged';
    parts?: string[];
    timeSpent: number;
  }
  
  export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    tags?: {
      aircraftModel?: string;
      issueCategory?: string;
    };
  }
  
  export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface AnalyticsData {
    completedMaintenance: number;
    pendingMaintenance: number;
    averageResolutionTime: number; // in minutes
    issuesByCategory: Record<string, number>;
    issuesByAircraft: Record<string, number>;
    weeklyCompletions: Array<{
      date: string;
      count: number;
    }>;
  }

  // Aircraft model types
export type AircraftModel = 
| 'Boeing 737'
| 'Airbus A320'
| 'Boeing 787'
| 'Airbus A350'
| 'Embraer E190';

// Issue category types
export type IssueCategory = 
| 'Mechanical'
| 'Electrical'
| 'Hydraulics'
| 'Avionics'
| 'Environmental'
| 'Structural';

// Message type for chat
export interface Message {
id: string;
role: 'user' | 'assistant';
content: string;
timestamp: Date;
tags?: {
  aircraftModel?: AircraftModel;
  issueCategory?: IssueCategory;
};
processingTime?: number;
isError?: boolean;
}

// Chat session type
export interface ChatSession {
id: string;
title: string;
lastUpdated: Date;
messages: ChatMessage[];
}