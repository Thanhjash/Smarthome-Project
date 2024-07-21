"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Thermometer, Droplet, Sun } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import socket from '@/lib/websocket';

Chart.register(...registerables);

interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
}

export const SensorOverview: React.FC = () => {
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(60);
  const [lightLevel, setLightLevel] = useState(500);
  const [lineChartData, setLineChartData] = useState<LineChartData>({
    labels: [],
    datasets: [
      { label: 'Temperature', data: [], borderColor: 'rgb(255, 99, 132)', fill: false },
      { label: 'Humidity', data: [], borderColor: 'rgb(54, 162, 235)', fill: false },
      { label: 'Light Level', data: [], borderColor: 'rgb(255, 206, 86)', fill: false },
    ],
  });

  useEffect(() => {
    socket.on('sensorData', (data) => {
      switch (data.type) {
        case 'temperature':
          setTemperature(data.value);
          updateChartData('Temperature', data.value);
          break;
        case 'humidity':
          setHumidity(data.value);
          updateChartData('Humidity', data.value);
          break;
        case 'light':
          setLightLevel(data.value);
          updateChartData('Light Level', data.value);
          break;
      }
    });

    return () => {
      socket.off('sensorData');
    };
  }, []);

  const updateChartData = (label, value) => {
    setLineChartData((prevState) => {
      const newLabels = [...prevState.labels, new Date().toLocaleTimeString()];
      const newDatasets = prevState.datasets.map((dataset) => {
        if (dataset.label === label) {
          return { ...dataset, data: [...dataset.data, value] };
        }
        return dataset;
      });

      return { labels: newLabels.slice(-10), datasets: newDatasets };
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Temperature, Humidity, and Light Level</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Line data={lineChartData} options={chartOptions} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="bg-gradient-to-br from-orange-400 to-red-600">
          <CardTitle className="text-white">Temperature</CardTitle>
          <Thermometer className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{temperature}°C</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="bg-gradient-to-br from-blue-400 to-cyan-600">
          <CardTitle className="text-white">Humidity</CardTitle>
          <Droplet className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{humidity}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="bg-gradient-to-br from-yellow-400 to-orange-600">
          <CardTitle className="text-white">Light Level</CardTitle>
          <Sun className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{lightLevel} lux</div>
        </CardContent>
      </Card>
    </div>
  );
};
