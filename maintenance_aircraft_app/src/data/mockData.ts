import { AnalyticsData, MaintenanceLog, ChatSession, User } from '../types';

export const currentUser: User = {
  id: 'tech123',
  name: 'Alex Rodriguez',
  role: 'Lead Technician',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
};

export const mockAnalytics: AnalyticsData = {
  completedMaintenance: 247,
  pendingMaintenance: 18,
  averageResolutionTime: 124, // in minutes
  issuesByCategory: {
    'Mechanical': 87,
    'Electrical': 63,
    'Hydraulics': 42,
    'Avionics': 54,
    'Environmental': 32,
    'Structural': 26
  },
  issuesByAircraft: {
    'Boeing 737': 76,
    'Airbus A320': 82,
    'Boeing 787': 48,
    'Airbus A350': 31,
    'Embraer E190': 28
  },
  weeklyCompletions: [
    { date: '2025-01-01', count: 12 },
    { date: '2025-01-08', count: 15 },
    { date: '2025-01-15', count: 9 },
    { date: '2025-01-22', count: 18 },
    { date: '2025-01-29', count: 14 },
    { date: '2025-02-05', count: 11 },
    { date: '2025-02-12', count: 16 }
  ]
};

export const mockMaintenanceLogs: MaintenanceLog[] = [
  {
    id: 'log001',
    date: '2025-02-15',
    aircraftModel: 'Boeing 737',
    tailNumber: 'N12345',
    technicianId: 'tech456',
    technicianName: 'Maria Chen',
    category: 'Mechanical',
    description: 'Engine #2 showing unusual vibration during taxiing',
    action: 'Inspected engine mount. Replaced worn bushings and performed vibration analysis. Engine now operating within normal parameters.',
    status: 'Completed',
    parts: ['EM-2234-B', 'BU-778-A'],
    timeSpent: 180
  },
  {
    id: 'log002',
    date: '2025-02-14',
    aircraftModel: 'Airbus A320',
    tailNumber: 'N54321',
    technicianId: 'tech789',
    technicianName: 'James Wilson',
    category: 'Electrical',
    description: 'Cabin lighting system failure in zones B and C',
    action: 'Traced issue to faulty PSU. Replaced unit and verified system functionality.',
    status: 'Completed',
    parts: ['PSU-A320-7'],
    timeSpent: 90
  },
  {
    id: 'log003',
    date: '2025-02-16',
    aircraftModel: 'Boeing 787',
    tailNumber: 'N78787',
    technicianId: 'tech123',
    technicianName: 'Alex Rodriguez',
    category: 'Avionics',
    description: 'TCAS showing intermittent failures during pre-flight',
    action: 'Diagnosed faulty connection. Pending replacement of wiring harness.',
    status: 'Pending',
    timeSpent: 60
  },
  {
    id: 'log004',
    date: '2025-02-13',
    aircraftModel: 'Airbus A350',
    tailNumber: 'N35035',
    technicianId: 'tech456',
    technicianName: 'Maria Chen',
    category: 'Hydraulics',
    description: 'Slow retraction of landing gear, left main',
    action: 'Identified hydraulic fluid leak at junction J47. Replaced O-ring and replenished fluid.',
    status: 'Completed',
    parts: ['OR-H-592'],
    timeSpent: 150
  },
  {
    id: 'log005',
    date: '2025-02-12',
    aircraftModel: 'Embraer E190',
    tailNumber: 'N19019',
    technicianId: 'tech789',
    technicianName: 'James Wilson',
    category: 'Environmental',
    description: 'Cabin temperature control erratic in flight',
    action: 'Recalibrated temperature sensors and updated control software to latest version.',
    status: 'Completed',
    timeSpent: 120
  },
  {
    id: 'log006',
    date: '2025-02-16',
    aircraftModel: 'Boeing 737',
    tailNumber: 'N73737',
    technicianId: 'tech123',
    technicianName: 'Alex Rodriguez',
    category: 'Structural',
    description: 'Minor dent observed on leading edge of right wing',
    action: 'Visual inspection performed. Dent measured and documented. Engineering assessment required.',
    status: 'Flagged',
    timeSpent: 45
  }
];

export const mockChatSessions: ChatSession[] = [
  {
    id: 'chat001',
    title: 'A320 APU Start Issue',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'I\'m having trouble with APU start sequence on an A320. It begins the start but then cuts off at about 50% N.',
        timestamp: new Date('2025-02-15T14:32:00'),
        tags: {
          aircraftModel: 'Airbus A320',
          issueCategory: 'Mechanical'
        }
      },
      {
        id: 'm2',
        role: 'assistant',
        content: 'This sounds like it could be related to the APU fuel system or ignition. When the APU cuts off at around 50% N, check the ECAM for any fault messages. Common causes include:\n\n1. Fuel supply issues (check APU fuel pump and filter)\n2. Ignition problems (check igniter plugs)\n3. Bleed air leaks affecting startup\n\nCan you access the Aircraft Maintenance Manual section 49-60-00? That covers APU troubleshooting procedures specific to this issue.',
        timestamp: new Date('2025-02-15T14:33:10')
      },
      {
        id: 'm3',
        role: 'user',
        content: 'The ECAM showed "APU FUEL LO PRESS" briefly before reset. I\'ve checked the fuel pump and it seems to be operating normally.',
        timestamp: new Date('2025-02-15T14:35:22'),
        tags: {
          issueCategory: 'Mechanical'
        }
      },
      {
        id: 'm4',
        role: 'assistant',
        content: 'The "APU FUEL LO PRESS" message confirms we"re looking at a fuel delivery issue. Since you\'ve verified the pump is operating, let\'s focus on other potential causes:\n\n1. Check the APU fuel filter for clogging - this is a common cause of low pressure warnings even with a functional pump\n2. Inspect the fuel lines for any obstructions or leaks\n3. Verify the fuel shut-off valve is fully opening\n\nThe AMM procedure in 49-61-00 outlines the fuel filter inspection process. Would you like me to provide the specific steps for that inspection?',
        timestamp: new Date('2025-02-15T14:36:45')
      }
    ],
    createdAt: new Date('2025-02-15T14:32:00'),
    updatedAt: new Date('2025-02-15T14:36:45')
  },
  {
    id: 'chat002',
    title: 'B737 Landing Gear Indicator',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'On a 737-800, we have an intermittent nose gear down-and-locked indicator issue. It occasionally flickers during flight.',
        timestamp: new Date('2025-02-14T09:15:00'),
        tags: {
          aircraftModel: 'Boeing 737',
          issueCategory: 'Electrical'
        }
      },
      {
        id: 'm2',
        role: 'assistant',
        content: 'Intermittent landing gear indicator issues on the 737-800 are often related to the position sensing circuit. The flickering suggests a connection problem rather than a mechanical issue with the gear itself. Here are the most common causes:\n\n1. Worn or dirty sensor contacts in the nose gear downlock mechanism\n2. Wiring harness chafing in the nose wheel well\n3. Corroded connections at the landing gear control interface unit\n4. Faulty indicator light/display component\n\nI recommend starting with an inspection of the downlock sensor on the nose gear and its electrical connections. Look for signs of corrosion, looseness, or damage to the wiring harness.',
        timestamp: new Date('2025-02-14T09:16:30')
      }
    ],
    createdAt: new Date('2025-02-14T09:15:00'),
    updatedAt: new Date('2025-02-14T09:16:30')
  }
];

export const generateLogSuggestion = (aircraftModel: string, issueCategory: string, description: string): string => {
  // This simulates what would normally be an LLM call
  return `AIRCRAFT: ${aircraftModel}
ISSUE CATEGORY: ${issueCategory}
COMPLAINT: ${description}

TROUBLESHOOTING:
1. Performed visual inspection of affected area
2. Consulted technical documentation (AMM 28-61-00)
3. Conducted operational test to reproduce issue
4. Identified [potential issue] in the [component/system]

CORRECTIVE ACTION:
1. [Removed/replaced/repaired] the affected [component]
2. Performed operational test to verify fix
3. Documented all work in aircraft maintenance system
4. Return to service after successful verification

PARTS USED:
- [Part number] (if applicable)

ADDITIONAL NOTES:
System functioning correctly after maintenance action. No anomalies observed during post-repair testing.`;
};

export const validateMaintenanceLog = (log: MaintenanceLog): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} => {
  // This simulates what would normally be an LLM-based validation
  const issues = [];
  const suggestions = [];
  
  if (log.description.length < 20) {
    issues.push("Description too brief - needs more detail");
    suggestions.push("Expand description to include observed symptoms and conditions");
  }
  
  if (log.action.length < 30) {
    issues.push("Action details insufficient");
    suggestions.push("Detail specific actions taken, tests performed, and results observed");
  }
  
  if (!log.parts || log.parts.length === 0) {
    suggestions.push("Consider adding part numbers for components replaced or inspected");
  }
  
  if (log.timeSpent < 30) {
    issues.push("Time spent seems unusually low for this type of maintenance");
    suggestions.push("Verify time spent is accurately recorded");
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
};