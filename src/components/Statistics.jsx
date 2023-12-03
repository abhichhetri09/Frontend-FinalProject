import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function Statistics({ data }) {
  // Assuming 'data' is an array of objects with 'activity' and 'duration' properties
  const chartData = {
    labels: data.map(item => item.activity), // Activity names
    datasets: [
      {
        label: 'Total Duration (min)',
        data: data.map(item => item.duration), // Total duration for each activity
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default Statistics;
