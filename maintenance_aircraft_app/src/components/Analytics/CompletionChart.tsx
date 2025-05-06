import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from '../ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CompletionChartProps {
  weeklyData: { date: string; count: number }[];
}

const CompletionChart: React.FC<CompletionChartProps> = ({ weeklyData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const data = {
    labels: weeklyData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Completed Maintenance Tasks',
        data: weeklyData.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  return (
    <Card title="Weekly Maintenance Completions">
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </Card>
  );
};

export default CompletionChart;