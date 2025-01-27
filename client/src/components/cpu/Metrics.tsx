import React from 'react';
import { Card } from '@/components/ui/card';
import { PerformanceMetrics } from '@/lib/simulation/cpu';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MetricsProps {
  metrics: PerformanceMetrics;
  history: PerformanceMetrics[];
}

const Metrics: React.FC<MetricsProps> = ({ metrics, history }) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <MetricCard 
          title="Instructions Per Cycle" 
          value={metrics.ipc.toFixed(2)}
          trend={metrics.ipc > 1 ? 'positive' : 'negative'}
        />
        <MetricCard 
          title="Cycles Per Instruction" 
          value={metrics.cpi.toFixed(2)}
          trend={metrics.cpi < 2 ? 'positive' : 'negative'}
        />
        <MetricCard 
          title="Branch Mispredictions" 
          value={metrics.branchMispredictions.toString()}
          trend="neutral"
        />
        <MetricCard 
          title="Cache Misses" 
          value={metrics.cacheMisses.toString()}
          trend="neutral"
        />
      </div>

      <div className="h-[300px]">
        <LineChart
          width={600}
          height={300}
          data={history}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cycleCount" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="ipc" 
            stroke="#8884d8" 
            name="IPC"
          />
          <Line 
            type="monotone" 
            dataKey="cpi" 
            stroke="#82ca9d" 
            name="CPI"
          />
        </LineChart>
      </div>
    </Card>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  trend: 'positive' | 'negative' | 'neutral';
}> = ({ title, value, trend }) => {
  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className={`text-2xl font-bold ${trendColors[trend]}`}>{value}</p>
    </div>
  );
};

export default Metrics;
