"use client";

import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useSensorData } from '@/hooks/useSensorData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export const SensorCharts: React.FC = () => {
  const { temperatureData, humidityData, lightData } = useSensorData();

  useEffect(() => {
    console.log("Temperature Data in SensorCharts: ", temperatureData);
    console.log("Humidity Data in SensorCharts: ", humidityData);
    console.log("Light Data in SensorCharts: ", lightData);
  }, [temperatureData, humidityData, lightData]);

  const data = {
    labels: temperatureData.map((data) => data.timestamp),
    datasets: [
      {
        label: 'Temperature',
        data: temperatureData.map((data) => data.value),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'Humidity',
        data: humidityData.map((data) => data.value),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      },
      {
        label: 'Light Level',
        data: lightData.map((data) => data.value),
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
