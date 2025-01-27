import { PipelineState, Instruction, Hazard } from './cpu';

export class PipelineSimulator {
  private state: PipelineState;

  constructor() {
    this.state = {
      fetch: null,
      decode: null,
      execute: null,
      memory: null,
      writeback: null,
      hazards: []
    };
  }

  public getState(): PipelineState {
    return {...this.state};
  }

  public step(): void {
    this.advanceStages();
    this.detectAndHandleHazards();
  }

  private advanceStages(): void {
    // Move instructions through pipeline stages
    this.state.writeback = this.state.memory;
    this.state.memory = this.state.execute;
    this.state.execute = this.state.decode;
    this.state.decode = this.state.fetch;
    
    // Fetch new instruction (simplified)
    this.state.fetch = this.generateRandomInstruction();
  }

  private detectAndHandleHazards(): void {
    this.state.hazards = [];
    
    // Data hazards
    this.detectDataHazards();
    
    // Control hazards
    this.detectControlHazards();
    
    // Structural hazards
    this.detectStructuralHazards();
  }

  private detectDataHazards(): void {
    if (this.state.decode && this.state.execute) {
      // RAW Hazard Detection
      if (this.state.decode.rs1 === this.state.execute.rd ||
          this.state.decode.rs2 === this.state.execute.rd) {
        this.state.hazards.push({
          type: 'RAW',
          source: this.state.execute,
          destination: this.state.decode
        });
      }
    }
  }

  private detectControlHazards(): void {
    if (this.state.execute?.type === 'B' || this.state.execute?.type === 'J') {
      this.state.hazards.push({
        type: 'Control',
        source: this.state.execute,
        destination: this.state.decode || this.state.fetch!
      });
    }
  }

  private detectStructuralHazards(): void {
    // Simplified structural hazard detection
    if (this.state.memory?.type === 'S' && this.state.execute?.type === 'S') {
      this.state.hazards.push({
        type: 'WAW',
        source: this.state.memory,
        destination: this.state.execute
      });
    }
  }

  private generateRandomInstruction(): Instruction {
    const types: ('R' | 'I' | 'S' | 'B' | 'U' | 'J')[] = ['R', 'I', 'S', 'B', 'U', 'J'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      opcode: Math.floor(Math.random() * 128),
      rd: Math.floor(Math.random() * 32),
      rs1: Math.floor(Math.random() * 32),
      rs2: Math.floor(Math.random() * 32),
      imm: Math.floor(Math.random() * 4096),
      type
    };
  }
}
