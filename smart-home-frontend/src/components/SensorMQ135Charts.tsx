"use client";

import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useSensorData } from '@/hooks/useSensorData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export const SensorMQ135Charts: React.FC = () => {
  const { mq135Data } = useSensorData();

  useEffect(() => {
    console.log("MQ135 Data in SensorMQ135Charts: ", mq135Data);
  }, [mq135Data]);

  const data = {
    labels: mq135Data.map((data) => data.timestamp),
    datasets: [
      {
        label: 'CO2',
        data: mq135Data.map((data) => data.co2),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'NH3',
        data: mq135Data.map((data) => data.nh3),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
