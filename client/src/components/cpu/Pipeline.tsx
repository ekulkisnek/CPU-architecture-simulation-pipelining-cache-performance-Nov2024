
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
import { Tooltip } from '@/components/ui/tooltip';
import { PipelineState, Instruction } from '@/lib/simulation/cpu';

interface PipelineProps {
  state: PipelineState;
}

const INSTRUCTION_TYPES = {
  'R': 'Register-type instruction (operations between registers)',
  'I': 'Immediate-type instruction (operations with immediate values)',
  'S': 'Store-type instruction (storing to memory)',
  'B': 'Branch-type instruction (conditional jumps)',
  'U': 'Upper immediate instruction (loading large constants)',
  'J': 'Jump-type instruction (unconditional jumps)'
};

const STAGE_DESCRIPTIONS = {
  'Fetch': 'Retrieves the next instruction from memory',
  'Decode': 'Decodes instruction and reads registers',
  'Execute': 'Performs the actual computation',
  'Memory': 'Accesses memory if needed',
  'Writeback': 'Writes results back to registers'
};

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
    { id: 'f-d', source: 'fetch', target: 'decode', type: 'smoothstep', animated: true },
    { id: 'd-e', source: 'decode', target: 'execute', type: 'smoothstep', animated: true },
    { id: 'e-m', source: 'execute', target: 'memory', type: 'smoothstep', animated: true },
    { id: 'm-w', source: 'memory', target: 'writeback', type: 'smoothstep', animated: true }
  ];

  state.hazards.forEach((hazard, index) => {
    const sourceId = getStageIdForInstruction(hazard.source, state);
    const targetId = getStageIdForInstruction(hazard.destination, state);

    if (sourceId && targetId) {
      edges.push({
        id: `hazard-${index}`,
        source: sourceId,
        target: targetId,
        animated: true,
        style: { stroke: '#ff0000', strokeWidth: 2 },
        type: 'smoothstep'
      });
    }
  });

  return (
    <Card className="w-full h-[400px] p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pipeline Visualization</h2>
        <div className="text-sm text-muted-foreground">
          <div className="flex gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span>Data Flow</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span>Hazards</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[320px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          defaultEdgeOptions={{ type: 'smoothstep' }}
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
  return (
    <div className="p-2">
      <Tooltip content={STAGE_DESCRIPTIONS[stage]}>
        <div className="font-bold mb-2">{stage}</div>
      </Tooltip>
      {instruction ? (
        <div className="text-sm">
          <Tooltip content={INSTRUCTION_TYPES[instruction.type]}>
            <div>Type: {instruction.type}</div>
          </Tooltip>
          <Tooltip content="Operation code - identifies the instruction type">
            <div>Opcode: 0x{instruction.opcode.toString(16)}</div>
          </Tooltip>
          <Tooltip content="Destination register where result will be stored">
            <div>rd: x{instruction.rd}</div>
          </Tooltip>
          {instruction.rs1 !== undefined && (
            <Tooltip content="First source register">
              <div>rs1: x{instruction.rs1}</div>
            </Tooltip>
          )}
          {instruction.rs2 !== undefined && (
            <Tooltip content="Second source register">
              <div>rs2: x{instruction.rs2}</div>
            </Tooltip>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500">Empty</div>
      )}
    </div>
  );
}

function getStageIdForInstruction(instruction: Instruction, state: PipelineState): string | null {
  if (state.fetch === instruction) return 'fetch';
  if (state.decode === instruction) return 'decode';
  if (state.execute === instruction) return 'execute';
  if (state.memory === instruction) return 'memory';
  if (state.writeback === instruction) return 'writeback';
  return null;
}

export default Pipeline;
