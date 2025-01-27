import { useState, useEffect, useCallback, useMemo } from 'react';
import { RISCVSimulator } from '../simulation/cpu';
import { PipelineSimulator } from '../simulation/pipeline';
import { CacheSimulator } from '../simulation/cache';

export function useSimulation() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms between steps

  const cpu = useMemo(() => new RISCVSimulator(), []);
  const pipeline = useMemo(() => new PipelineSimulator(), []);
  const cache = useMemo(() => new CacheSimulator(), []);

  const [cpuState, setCpuState] = useState(cpu.getState());
  const [pipelineState, setPipelineState] = useState(pipeline.getState());
  const [cacheState, setCacheState] = useState(cache.getState());

  const step = useCallback(() => {
    cpu.step();
    pipeline.step();
    cache.simulateRandomAccess();

    setCpuState(cpu.getState());
    setPipelineState(pipeline.getState());
    setCacheState(cache.getState());
  }, [cpu, pipeline, cache]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (running) {
      interval = setInterval(step, speed);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [running, speed, step]);

  const toggleSimulation = useCallback(() => {
    setRunning(prev => !prev);
  }, []);

  const setSimulationSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  return {
    running,
    speed,
    cpuState,
    pipelineState,
    cacheState,
    toggleSimulation,
    setSimulationSpeed,
    step
  };
}

export type SimulationHook = ReturnType<typeof useSimulation>;
