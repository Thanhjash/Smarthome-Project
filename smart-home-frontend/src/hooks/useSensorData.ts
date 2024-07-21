"use client";

import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

interface SensorData {
  timestamp: string;
  value?: number;
  smoke?: number;
  co?: number;
  lpg?: number;
  co2?: number;
  nh3?: number;
}

interface DeviceStatus {
  led: boolean;
  buzzer: boolean;
  motorA: number;
  motorB: number;
  autoMode: boolean;
  lightStatus: boolean;
  fanSpeed: number;
  ventilationSpeed: number;
}

export const useSensorData = () => {
  const [temperatureData, setTemperatureData] = useState<SensorData[]>([]);
  const [humidityData, setHumidityData] = useState<SensorData[]>([]);
  const [lightData, setLightData] = useState<SensorData[]>([]);
  const [mq2Data, setMq2Data] = useState<SensorData[]>([]);
  const [mq135Data, setMq135Data] = useState<SensorData[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    led: false,
    buzzer: false,
    motorA: 0,
    motorB: 0,
    autoMode: false,
    lightStatus: false,
    fanSpeed: 0,
    ventilationSpeed: 0,
  });

  useEffect(() => {
    const mqttBrokerUrl = 'wss://a5a837afc1a3432f92735c39f5f4d500.s1.eu.hivemq.cloud:8884/mqtt';
    const mqttUsername = 'Thanhjash';
    const mqttPassword = 'Hunter.j17';

    const options = {
      username: mqttUsername,
      password: mqttPassword,
      connectTimeout: 30000,
      reconnectPeriod: 2000,
      clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
      clean: true,
    };

    const client = mqtt.connect(mqttBrokerUrl, options);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('home/#', (err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
        } else {
          console.log('Subscribed to home/# topic');
        }
      });
    });

    client.on('message', (topic, message) => {
      console.log('Received message on topic:', topic);
      console.log('Message:', message.toString());
      try {
        const data = JSON.parse(message.toString());
        const timestamp = new Date().toISOString();

        if (topic === 'home/sensors' || topic === 'home') {
          const sensors = topic === 'home' ? data.sensors : data;
          
          if (sensors.temperature !== undefined) 
            setTemperatureData((prev) => [...prev, { timestamp, value: sensors.temperature }].slice(-50));
          if (sensors.humidity !== undefined) 
            setHumidityData((prev) => [...prev, { timestamp, value: sensors.humidity }].slice(-50));
          if (sensors.light !== undefined) 
            setLightData((prev) => [...prev, { timestamp, value: sensors.light }].slice(-50));
          if (sensors.smoke !== undefined || sensors.co !== undefined || sensors.lpg !== undefined) {
            setMq2Data((prev) => [...prev, { 
              timestamp, 
              smoke: sensors.smoke, 
              co: sensors.co, 
              lpg: sensors.lpg 
            }].slice(-50));
          }
          if (sensors.co2 !== undefined || sensors.nh3 !== undefined) {
            setMq135Data((prev) => [...prev, { 
              timestamp, 
              co2: sensors.co2, 
              nh3: sensors.nh3 
            }].slice(-50));
          }
        }

        if (topic === 'home/device_status' || topic === 'home') {
          const device_status = topic === 'home' ? data.device_status : data;
          setDeviceStatus({
            led: device_status.led || false,
            buzzer: device_status.buzzer || false,
            motorA: device_status.motorA || 0,
            motorB: device_status.motorB || 0,
            autoMode: device_status.autoMode || false,
            lightStatus: device_status.lightStatus || false,
            fanSpeed: device_status.fanSpeed || 0,
            ventilationSpeed: device_status.ventilationSpeed || 0,
          });
        }
        
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    client.on('error', (err) => {
      console.error('MQTT client error:', err);
    });

    client.on('close', () => {
      console.log('MQTT client disconnected');
    });

    client.on('reconnect', () => {
      console.log('MQTT client reconnecting');
    });

    return () => {
      console.log('Disconnecting from MQTT broker');
      client.end();
    };
  }, []);

  return {
    temperatureData,
    humidityData,
    lightData,
    mq2Data,
    mq135Data,
    deviceStatus,
  };
};
