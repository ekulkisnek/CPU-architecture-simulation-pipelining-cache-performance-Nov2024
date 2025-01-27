import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CacheState } from '@/lib/simulation/cpu';

interface CacheProps {
  state: CacheState;
}

const Cache: React.FC<CacheProps> = ({ state }) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cache Performance</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Hit Rate</span>
            <span className="text-green-600">{state.hitRate.toFixed(2)}%</span>
          </div>
          <Progress value={state.hitRate} className="bg-gray-200">
            <div 
              className="h-full bg-green-500 transition-all" 
              style={{ width: `${state.hitRate}%` }}
            />
          </Progress>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Miss Rate</span>
            <span className="text-red-600">{state.missRate.toFixed(2)}%</span>
          </div>
          <Progress value={state.missRate} className="bg-gray-200">
            <div 
              className="h-full bg-red-500 transition-all" 
              style={{ width: `${state.missRate}%` }}
            />
          </Progress>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <CacheLevel 
            name="L1 Data" 
            entries={state.l1d} 
          />
          <CacheLevel 
            name="L1 Instruction" 
            entries={state.l1i} 
          />
          <CacheLevel 
            name="L2 Unified" 
            entries={state.l2} 
          />
        </div>
      </div>
    </Card>
  );
};

const CacheLevel: React.FC<{
  name: string;
  entries: Array<{valid: boolean; dirty: boolean}>;
}> = ({ name, entries }) => {
  const validCount = entries.filter(e => e.valid).length;
  const dirtyCount = entries.filter(e => e.dirty).length;
  const utilization = (validCount / entries.length) * 100;

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium mb-2">{name}</h3>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Utilization:</span>
          <span>{utilization.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Valid Lines:</span>
          <span>{validCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Dirty Lines:</span>
          <span>{dirtyCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Cache;
