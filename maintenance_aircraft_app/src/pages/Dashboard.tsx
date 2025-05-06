import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Wrench, Plane } from 'lucide-react';
import StatCard from '../components/Analytics/StatCard';
import CompletionChart from '../components/Analytics/CompletionChart';
import IssuesPieChart from '../components/Analytics/IssuesPieChart';
import { mockAnalytics } from '../data/mockData';

const Dashboard: React.FC = () => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Maintenance Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Overview of maintenance activities and performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed Maintenance"
          value={mockAnalytics.completedMaintenance}
          icon={<CheckCircle size={20} className="text-blue-600 dark:text-blue-400" />}
          trend={{ value: 12, label: 'vs last month', positive: true }}
        />
        
        <StatCard
          title="Pending Tasks"
          value={mockAnalytics.pendingMaintenance}
          icon={<AlertTriangle size={20} className="text-orange-500" />}
          trend={{ value: 5, label: 'vs last month', positive: false }}
        />
        
        <StatCard
          title="Average Resolution Time"
          value={formatTime(mockAnalytics.averageResolutionTime)}
          icon={<Clock size={20} className="text-teal-500" />}
          trend={{ value: 8, label: 'faster than last month', positive: true }}
        />
        
        <StatCard
          title="System Health"
          value="96.7%"
          icon={<Wrench size={20} className="text-green-500" />}
          trend={{ value: 2.1, label: 'improvement', positive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompletionChart weeklyData={mockAnalytics.weeklyCompletions} />
        
        <div className="grid grid-cols-1 gap-6">
          <IssuesPieChart 
            data={mockAnalytics.issuesByCategory} 
            title="Issues by Category" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <IssuesPieChart 
          data={mockAnalytics.issuesByAircraft} 
          title="Issues by Aircraft Model" 
        />
      </div>
    </div>
  );
};

export default Dashboard;