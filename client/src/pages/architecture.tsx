import React from 'react';
import { useSimulation } from '@/lib/hooks/useSimulation';
import Pipeline from '@/components/cpu/Pipeline';
import Cache from '@/components/cpu/Cache';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward } from 'lucide-react';

const Architecture = () => {
  const {
    running,
    speed,
    cpuState,
    pipelineState,
    cacheState,
    toggleSimulation,
    setSimulationSpeed,
    step
  } = useSimulation();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">CPU Architecture Simulation</h1>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleSimulation}
                className="w-32"
              >
                {running ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
              <Button
                onClick={step}
                variant="outline"
                disabled={running}
              >
                <SkipForward className="mr-2 h-4 w-4" />
                Step
              </Button>
              <div className="flex-1 flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-32">
                  Simulation Speed: {speed}ms
                </span>
                <Slider
                  min={100}
                  max={2000}
                  step={100}
                  value={[speed]}
                  onValueChange={([value]) => setSimulationSpeed(value)}
                  className="w-48"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Pipeline state={pipelineState} />
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Register State</h2>
              <div className="grid grid-cols-4 gap-2">
                {cpuState.registers.map((value, index) => (
                  <div key={index} className="p-2 border rounded">
                    <div className="text-sm text-muted-foreground">x{index}</div>
                    <div className="font-mono">0x{value.toString(16)}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Cache state={cacheState} />
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Pipeline Hazards</h2>
              <div className="space-y-2">
                {pipelineState.hazards.map((hazard, index) => (
                  <div key={index} className="p-2 border rounded">
                    <div className="font-medium text-red-500">{hazard.type} Hazard</div>
                    <div className="text-sm text-muted-foreground">
                      Between {hazard.source.type} and {hazard.destination.type} instructions
                    </div>
                  </div>
                ))}
                {pipelineState.hazards.length === 0 && (
                  <div className="text-muted-foreground">No hazards detected</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Architecture;
