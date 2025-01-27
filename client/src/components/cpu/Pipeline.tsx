import React from 'react';
import ReactFlow, { 
  Node, 
  Edge,
  Background,
  Controls,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from '@/components/ui/card';
import { PipelineState, Instruction } from '@/lib/simulation/cpu';

interface PipelineProps {
  state: PipelineState;
}

const Pipeline: React.FC<PipelineProps> = ({ state }) => {
  const nodes: Node[] = [
    {
      id: 'fetch',
      type: 'default',
      position: { x: 0, y: 100 },
      data: { label: createStageLabel('Fetch', state.fetch) }
    },
    {
      id: 'decode',
      type: 'default',
      position: { x: 200, y: 100 },
      data: { label: createStageLabel('Decode', state.decode) }
    },
    {
      id: 'execute',
      type: 'default',
      position: { x: 400, y: 100 },
      data: { label: createStageLabel('Execute', state.execute) }
    },
    {
      id: 'memory',
      type: 'default',
      position: { x: 600, y: 100 },
      data: { label: createStageLabel('Memory', state.memory) }
    },
    {
      id: 'writeback',
      type: 'default',
      position: { x: 800, y: 100 },
      data: { label: createStageLabel('Writeback', state.writeback) }
    }
  ];

  const edges: Edge[] = [
    { id: 'f-d', source: 'fetch', target: 'decode' },
    { id: 'd-e', source: 'decode', target: 'execute' },
    { id: 'e-m', source: 'execute', target: 'memory' },
    { id: 'm-w', source: 'memory', target: 'writeback' }
  ];

  state.hazards.forEach((hazard, index) => {
    const sourceId = getStageIdForInstruction(hazard.source);
    const targetId = getStageIdForInstruction(hazard.destination);

    if (sourceId && targetId) {
      edges.push({
        id: `hazard-${index}`,
        source: sourceId,
        target: targetId,
        animated: true,
        style: { stroke: '#ff0000' }
      });
    }
  });

  return (
    <Card className="w-full h-[400px] p-4">
      <h2 className="text-2xl font-bold mb-4">Pipeline Visualization</h2>
      <div className="w-full h-[320px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </Card>
  );
};

function createStageLabel(stage: string, instruction: Instruction | null): React.ReactNode {
  if (!instruction) {
    return (
      <div className="p-2">
        <div className="font-bold">{stage}</div>
        <div className="text-sm text-gray-500">Empty</div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="font-bold">{stage}</div>
      <div className="text-sm">
        <div>Type: {instruction.type}</div>
        <div>Opcode: 0x{instruction.opcode.toString(16)}</div>
        <div>rd: {instruction.rd}</div>
      </div>
    </div>
  );
}

function getStageIdForInstruction(instruction: Instruction): string | null {
  const stages = ['fetch', 'decode', 'execute', 'memory', 'writeback'];

  // Find which stage contains this instruction
  for (const stage of stages) {
    if (instruction === (pipeline as any)[stage]) {
      return stage;
    }
  }

  return null;
}

export default Pipeline;