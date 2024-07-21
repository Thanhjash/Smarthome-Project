"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Slider } from '@/components/ui/Slider';
import { Label } from '@/components/ui/Label';
import { toast } from 'react-hot-toast';
import { useSensorData } from '@/hooks/useSensorData';

export const DeviceControl: React.FC = () => {
  const { deviceStatus } = useSensorData();
  const [lightOn, setLightOn] = useState(deviceStatus.lightStatus);
  const [fanSpeed, setFanSpeed] = useState(deviceStatus.fanSpeed);
  const [ventilationSpeed, setVentilationSpeed] = useState(deviceStatus.ventilationSpeed);

  useEffect(() => {
    setLightOn(deviceStatus.lightStatus);
    setFanSpeed(deviceStatus.fanSpeed);
    setVentilationSpeed(deviceStatus.ventilationSpeed);
  }, [deviceStatus]);

  const updateDeviceState = async (device: string, value: boolean | number) => {
    try {
      const response = await fetch(`/api/device/${device}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ state: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update device state');
      }

      toast.success(`${device} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${device}:`, error);
      toast.error(`Failed to update ${device}`);
    }
  };

  const handleLightToggle = async () => {
    const newState = !lightOn;
    await updateDeviceState('light', newState);
    setLightOn(newState);
  };

  const handleFanSpeedChange = async (value: number) => {
    await updateDeviceState('fan', value);
    setFanSpeed(value);
  };

  const handleVentilationSpeedChange = async (value: number) => {
    await updateDeviceState('ventilation', value);
    setVentilationSpeed(value);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Light Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch checked={lightOn} onCheckedChange={handleLightToggle} />
            <Label>{lightOn ? 'ON' : 'OFF'}</Label>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Fan Control</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[fanSpeed]}
            onValueChange={(value) => handleFanSpeedChange(value[0])}
          />
          <div className="mt-2">Speed: {fanSpeed}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ventilation Control</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[ventilationSpeed]}
            onValueChange={(value) => handleVentilationSpeedChange(value[0])}
          />
          <div className="mt-2">Speed: {ventilationSpeed}%</div>
        </CardContent>
      </Card>
    </div>
  );
};