// src/app/sensors/page.tsx
"use client";

import React, { useEffect, useState } from 'react';

interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: string;
}

const SensorsPage: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('/api/sensors');
        if (!response.ok) {
          throw new Error('Failed to fetch sensor data');
        }
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensorData();
  }, []);

  return (
    <div>
      <h1>Sensor Data</h1>
      {isLoading ? (
        <p>Loading sensor data...</p>
      ) : (
        <ul>
          {sensorData.map((data, index) => (
            <li key={index}>
              Temperature: {data.temperature}°C, Humidity: {data.humidity}%, Timestamp: {data.timestamp}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SensorsPage;
