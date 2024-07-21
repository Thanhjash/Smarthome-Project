import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LightbulbIcon, Fan, Wind, AlertCircle, Settings } from 'lucide-react';
import { useSensorData } from '@/hooks/useSensorData';

export const DeviceStatus: React.FC = () => {
  const { deviceStatus } = useSensorData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Status</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-4">
        <DeviceStatusItem
          name="Light"
          state={deviceStatus.lightStatus}
          Icon={LightbulbIcon}
        />
        <DeviceStatusItem
          name="Fan"
          state={deviceStatus.fanSpeed}
          Icon={Fan}
        />
        <DeviceStatusItem
          name="Ventilation"
          state={deviceStatus.ventilationSpeed}
          Icon={Wind}
        />
        <DeviceStatusItem
          name="Buzzer"
          state={deviceStatus.buzzer}
          Icon={AlertCircle}
        />
        <DeviceStatusItem
          name="Auto Mode"
          state={deviceStatus.autoMode}
          Icon={Settings}
        />
      </CardContent>
    </Card>
  );
};

interface DeviceStatusItemProps {
  name: string;
  state: boolean | number;
  Icon: React.ElementType;
}

const DeviceStatusItem: React.FC<DeviceStatusItemProps> = ({ name, state, Icon }) => (
  <div className="flex flex-col items-center">
    <Icon className={`h-8 w-8 ${state ? 'text-green-400' : 'text-gray-400'}`} />
    <span className="mt-2">{name}</span>
    <span className={`font-bold ${state ? 'text-green-500' : 'text-red-500'}`}>
      {typeof state === 'boolean' ? (state ? 'ON' : 'OFF') : `${state}%`}
    </span>
  </div>
);
