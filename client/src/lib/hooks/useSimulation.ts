import { useState, useEffect, useCallback, useMemo } from 'react';
import { RISCVSimulator } from '../simulation/cpu';
import { PipelineSimulator } from '../simulation/pipeline';
import { CacheSimulator } from '../simulation/cache';
import { useToast } from '@/hooks/use-toast';

export function useSimulation() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms between steps
  const { toast } = useToast();

  const cpu = useMemo(() => new RISCVSimulator(), []);
  const pipeline = useMemo(() => new PipelineSimulator(), []);
  const cache = useMemo(() => new CacheSimulator(), []);

  const [cpuState, setCpuState] = useState(cpu.getState());
  const [pipelineState, setPipelineState] = useState(pipeline.getState());
  const [cacheState, setCacheState] = useState(cache.getState());

  const step = useCallback(() => {
    try {
      cpu.step();
      pipeline.step();
      cache.simulateRandomAccess();

      setCpuState(cpu.getState());
      setPipelineState(pipeline.getState());
      setCacheState(cache.getState());
    } catch (error) {
      console.error('Simulation step failed:', error);
      setRunning(false);
      toast({
        title: "Simulation Error",
        description: "An error occurred during simulation. Stopping.",
        variant: "destructive"
      });
    }
  }, [cpu, pipeline, cache, toast]);

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

  // Handle WebSocket connection
  useEffect(() => {
    let ws: WebSocket;

    const setupWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const wsUrl = `${protocol}//${host}`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('Connected to simulation server');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            switch (data.type) {
              case 'SIMULATION_STARTED':
                setRunning(true);
                break;
              case 'SIMULATION_STOPPED':
                setRunning(false);
                break;
              case 'METRICS_UPDATED':
                // Handle metrics update if needed
                break;
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          toast({
            title: "Connection Error",
            description: "Failed to connect to simulation server.",
            variant: "destructive"
          });
        };

        ws.onclose = () => {
          console.log('Disconnected from simulation server');
          // Attempt to reconnect after a delay
          setTimeout(setupWebSocket, 5000);
        };
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
      }
    };

    setupWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [toast]);

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