import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Card from '../ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IssuesPieChartProps {
  data: Record<string, number>;
  title: string;
}

const IssuesPieChart: React.FC<IssuesPieChartProps> = ({ data, title }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(45, 212, 191, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 88, 12, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(45, 212, 191, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(234, 88, 12, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
    },
  };

  return (
    <Card title={title}>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default IssuesPieChart;