
import { PipelineSimulator } from './pipeline';

export interface CPUState {
  pc: number;
  registers: number[];
  memory: Uint32Array;
  pipeline: PipelineState;
  cache: CacheState;
  metrics: PerformanceMetrics;
}

export interface PipelineState {
  fetch: Instruction | null;
  decode: Instruction | null;
  execute: Instruction | null;
  memory: Instruction | null;
  writeback: Instruction | null;
  hazards: Hazard[];
}

export interface CacheState {
  l1d: CacheEntry[];
  l1i: CacheEntry[];
  l2: CacheEntry[];
  missRate: number;
  hitRate: number;
}

export interface Instruction {
  opcode: number;
  rd: number;
  rs1: number;
  rs2: number;
  imm: number;
  type: 'R' | 'I' | 'S' | 'B' | 'U' | 'J';
  result?: number;
}

export interface CacheEntry {
  tag: number;
  data: number[];
  valid: boolean;
  dirty: boolean;
}

export interface Hazard {
  type: 'RAW' | 'WAR' | 'WAW' | 'Control';
  source: Instruction;
  destination: Instruction;
}

export interface PerformanceMetrics {
  ipc: number;
  cpi: number;
  branchMispredictions: number;
  cacheMisses: number;
  cycleCount: number;
  instructionCount: number;
}

const OPCODE_MAP = {
  0x33: { name: 'ADD', type: 'R' },
  0x13: { name: 'ADDI', type: 'I' },
  0x23: { name: 'SW', type: 'S' },
  0x63: { name: 'BEQ', type: 'B' },
  0x37: { name: 'LUI', type: 'U' },
  0x6F: { name: 'JAL', type: 'J' }
};

export class RISCVSimulator {
  private state: CPUState;
  private pipelineSimulator: PipelineSimulator;
  
  constructor() {
    this.state = {
      pc: 0,
      registers: new Array(32).fill(0),
      memory: new Uint32Array(1024),
      pipeline: {
        fetch: null,
        decode: null,
        execute: null,
        memory: null,
        writeback: null,
        hazards: []
      },
      cache: {
        l1d: [],
        l1i: [],
        l2: [],
        missRate: 0,
        hitRate: 100
      },
      metrics: {
        ipc: 0,
        cpi: 0,
        branchMispredictions: 0,
        cacheMisses: 0,
        cycleCount: 0,
        instructionCount: 0
      }
    };
    
    this.pipelineSimulator = new PipelineSimulator();
  }

  public step(): void {
    this.updatePipeline();
    this.updateCache();
    this.updateMetrics();
  }

  public getState(): CPUState {
    return {...this.state};
  }

  private updatePipeline(): void {
    // Execute writeback stage first to update registers
    if (this.state.pipeline.writeback) {
      this.executeWriteback(this.state.pipeline.writeback);
    }

    // Execute memory stage
    if (this.state.pipeline.memory) {
      this.executeMemoryStage(this.state.pipeline.memory);
    }

    // Execute ALU operations
    if (this.state.pipeline.execute) {
      this.executeALU(this.state.pipeline.execute);
    }

    // Update pipeline stages
    this.state.pipeline.writeback = this.state.pipeline.memory;
    this.state.pipeline.memory = this.state.pipeline.execute;
    this.state.pipeline.execute = this.state.pipeline.decode;
    this.state.pipeline.decode = this.state.pipeline.fetch;
    this.state.pipeline.fetch = this.fetchNextInstruction();

    // Update hazards
    this.detectHazards();
  }

  private executeWriteback(instruction: Instruction): void {
    if (instruction.rd !== 0 && instruction.result !== undefined) { // x0 is hardwired to 0
      this.state.registers[instruction.rd] = instruction.result;
    }
  }

  private executeMemoryStage(instruction: Instruction): void {
    if (instruction.type === 'S') {
      const address = instruction.result!;
      this.state.memory[address] = this.state.registers[instruction.rs2];
    }
  }

  private executeALU(instruction: Instruction): void {
    const rs1_val = this.state.registers[instruction.rs1];
    const rs2_val = instruction.type === 'I' ? instruction.imm : this.state.registers[instruction.rs2];

    switch (instruction.opcode) {
      case 0x33: // ADD
        instruction.result = rs1_val + rs2_val;
        break;
      case 0x13: // ADDI
        instruction.result = rs1_val + instruction.imm;
        break;
      case 0x23: // SW
        instruction.result = rs1_val + instruction.imm; // Calculate address
        break;
      case 0x63: // BEQ
        if (rs1_val === rs2_val) {
          this.state.pc += instruction.imm;
        }
        break;
      case 0x37: // LUI
        instruction.result = instruction.imm << 12;
        break;
      case 0x6F: // JAL
        instruction.result = this.state.pc + 4;
        this.state.pc += instruction.imm;
        break;
    }
  }

  private fetchNextInstruction(): Instruction {
    // Simplified instruction fetch that generates random instructions
    const opcodes = Object.keys(OPCODE_MAP).map(k => parseInt(k, 16));
    const opcode = opcodes[Math.floor(Math.random() * opcodes.length)];
    
    const instruction: Instruction = {
      opcode,
      rd: Math.floor(Math.random() * 32),
      rs1: Math.floor(Math.random() * 32),
      rs2: Math.floor(Math.random() * 32),
      imm: Math.floor(Math.random() * 4096),
      type: OPCODE_MAP[opcode].type
    };

    this.state.metrics.instructionCount++;
    return instruction;
  }

  private detectHazards(): void {
    this.state.pipeline.hazards = [];
    
    // Data hazards (RAW)
    if (this.state.pipeline.decode && this.state.pipeline.execute) {
      const decode = this.state.pipeline.decode;
      const execute = this.state.pipeline.execute;
      
      if (decode.rs1 === execute.rd || decode.rs2 === execute.rd) {
        this.state.pipeline.hazards.push({
          type: 'RAW',
          source: execute,
          destination: decode
        });
      }
    }

    // Control hazards
    if (this.state.pipeline.execute?.type === 'B' || 
        this.state.pipeline.execute?.type === 'J') {
      if (this.state.pipeline.decode) {
        this.state.pipeline.hazards.push({
          type: 'Control',
          source: this.state.pipeline.execute,
          destination: this.state.pipeline.decode
        });
      }
    }
  }

  private updateCache(): void {
    // Simplified cache simulation
    const randomHit = Math.random() > 0.2;
    if (!randomHit) {
      this.state.metrics.cacheMisses++;
      this.state.cache.missRate = 
        this.state.metrics.cacheMisses / this.state.metrics.cycleCount * 100;
      this.state.cache.hitRate = 100 - this.state.cache.missRate;
    }
  }

  private updateMetrics(): void {
    this.state.metrics.cycleCount++;
    this.state.metrics.ipc = this.state.metrics.instructionCount / this.state.metrics.cycleCount;
    this.state.metrics.cpi = this.state.metrics.cycleCount / this.state.metrics.instructionCount;
  }
}
