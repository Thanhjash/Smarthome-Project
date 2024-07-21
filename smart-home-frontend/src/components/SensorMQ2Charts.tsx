"use client";

import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useSensorData } from '@/hooks/useSensorData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export const SensorMQ2Charts: React.FC = () => {
  const { mq2Data } = useSensorData();

  useEffect(() => {
    console.log("MQ2 Data in SensorMQ2Charts: ", mq2Data);
  }, [mq2Data]);

  const data = {
    labels: mq2Data.map((data) => data.timestamp),
    datasets: [
      {
        label: 'Smoke',
        data: mq2Data.map((data) => data.smoke),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'CO',
        data: mq2Data.map((data) => data.co),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      },
      {
        label: 'LPG',
        data: mq2Data.map((data) => data.lpg),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-96">
      {data.labels.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};
