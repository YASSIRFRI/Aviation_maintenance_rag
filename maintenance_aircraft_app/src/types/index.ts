export type AircraftModel = 'Boeing 737' | 'Airbus A320' | 'Boeing 787' | 'Airbus A350' | 'Embraer E190';

export type IssueCategory = 'Mechanical' | 'Electrical' | 'Hydraulics' | 'Avionics' | 'Environmental' | 'Structural';

export type MaintenanceLog = {
  id: string;
  date: string;
  aircraftModel: AircraftModel;
  tailNumber: string;
  technicianId: string;
  technicianName: string;
  category: IssueCategory;
  description: string;
  action: string;
  status: 'Completed' | 'Pending' | 'Flagged';
  parts?: string[];
  timeSpent: number; // in minutes
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tags?: {
    aircraftModel?: AircraftModel;
    issueCategory?: IssueCategory;
  };
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export type AnalyticsData = {
  completedMaintenance: number;
  pendingMaintenance: number;
  averageResolutionTime: number; // in minutes
  issuesByCategory: Record<IssueCategory, number>;
  issuesByAircraft: Record<AircraftModel, number>;
  weeklyCompletions: {
    date: string;
    count: number;
  }[];
};

export type User = {
  id: string;
  name: string;
  role: 'Technician' | 'Lead Technician' | 'Engineer' | 'Manager';
  avatar: string;
};