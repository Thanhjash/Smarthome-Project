"use client";

import React from 'react';
import { Layout } from '@/components/Layout';
import { SensorOverview } from '@/components/SensorOverview';
import { SensorCharts } from '@/components/SensorCharts';
import { SensorMQ2Charts } from '@/components/SensorMQ2Charts';
import { SensorMQ135Charts } from '@/components/SensorMQ135Charts';
import { DeviceStatus } from '@/components/DeviceStatus';
import { DeviceControl } from '@/components/DeviceControl';

const SensorDashboard: React.FC = () => {
  return (
    <Layout isAdmin={false}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 gap-6">
          <SensorOverview />
          <SensorCharts />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <DeviceStatus />
          <DeviceControl />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <SensorMQ2Charts />
          <SensorMQ135Charts />
        </div>
      </div>
    </Layout>
  );
};

export default SensorDashboard;
