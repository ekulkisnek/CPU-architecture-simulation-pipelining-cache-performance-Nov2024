import React, { useState, useEffect } from 'react';
import { useSimulation } from '@/lib/hooks/useSimulation';
import Metrics from '@/components/cpu/Metrics';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PerformanceMetrics } from '@/lib/simulation/cpu';

const Performance = () => {
  const { cpuState } = useSimulation();
  const [metricsHistory, setMetricsHistory] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    setMetricsHistory(prev => [...prev, cpuState.metrics].slice(-100));
  }, [cpuState.metrics]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Performance Analysis</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive analysis of CPU performance metrics and trends
          </p>
        </div>

        <div className="space-y-6">
          <Metrics metrics={cpuState.metrics} history={metricsHistory} />

          <Tabs defaultValue="pipeline">
            <TabsList>
              <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
              <TabsTrigger value="cache">Cache Analysis</TabsTrigger>
              <TabsTrigger value="branch">Branch Prediction</TabsTrigger>
            </TabsList>

            <TabsContent value="pipeline">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Pipeline Efficiency</h3>
                <div className="h-[400px]">
                  <LineChart
                    width={800}
                    height={400}
                    data={metricsHistory}
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
                      name="Instructions Per Cycle"
                    />
                  </LineChart>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="cache">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Cache Performance</h3>
                <div className="h-[400px]">
                  <LineChart
                    width={800}
                    height={400}
                    data={metricsHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cycleCount" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cacheMisses"
                      stroke="#82ca9d"
                      name="Cache Misses"
                    />
                  </LineChart>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="branch">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Branch Prediction Accuracy</h3>
                <div className="h-[400px]">
                  <LineChart
                    width={800}
                    height={400}
                    data={metricsHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cycleCount" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="branchMispredictions"
                      stroke="#ff7300"
                      name="Branch Mispredictions"
                    />
                  </LineChart>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Performance;
