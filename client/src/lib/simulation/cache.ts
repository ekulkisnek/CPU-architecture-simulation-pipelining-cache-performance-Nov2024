import { CacheState, CacheEntry } from './cpu';

export class CacheSimulator {
  private state: CacheState;
  private readonly L1_SIZE = 32;
  private readonly L2_SIZE = 128;

  constructor() {
    this.state = {
      l1d: this.initializeCache(this.L1_SIZE),
      l1i: this.initializeCache(this.L1_SIZE),
      l2: this.initializeCache(this.L2_SIZE),
      missRate: 0,
      hitRate: 100
    };
  }

  private initializeCache(size: number): CacheEntry[] {
    return Array(size).fill(null).map(() => ({
      tag: 0,
      data: new Array(4).fill(0),
      valid: false,
      dirty: false
    }));
  }

  public getState(): CacheState {
    return {...this.state};
  }

  public access(address: number, isInstruction: boolean): boolean {
    const l1Cache = isInstruction ? this.state.l1i : this.state.l1d;
    const index = this.getIndex(address, this.L1_SIZE);
    const tag = this.getTag(address, this.L1_SIZE);

    // Check L1 Cache
    if (this.checkCache(l1Cache, index, tag)) {
      this.updateHitRate(true);
      return true;
    }

    // L1 Miss, check L2
    const l2Index = this.getIndex(address, this.L2_SIZE);
    const l2Tag = this.getTag(address, this.L2_SIZE);

    if (this.checkCache(this.state.l2, l2Index, l2Tag)) {
      // L2 Hit, update L1
      this.updateL1Cache(l1Cache, index, tag);
      this.updateHitRate(true);
      return true;
    }

    // L2 Miss
    this.updateL2Cache(l2Index, l2Tag);
    this.updateL1Cache(l1Cache, index, tag);
    this.updateHitRate(false);
    return false;
  }

  private checkCache(cache: CacheEntry[], index: number, tag: number): boolean {
    return cache[index].valid && cache[index].tag === tag;
  }

  private updateL1Cache(cache: CacheEntry[], index: number, tag: number): void {
    cache[index].tag = tag;
    cache[index].valid = true;
    cache[index].dirty = false;
    cache[index].data = new Array(4).fill(Math.random() * 256 | 0);
  }

  private updateL2Cache(index: number, tag: number): void {
    this.state.l2[index].tag = tag;
    this.state.l2[index].valid = true;
    this.state.l2[index].dirty = false;
    this.state.l2[index].data = new Array(4).fill(Math.random() * 256 | 0);
  }

  private getIndex(address: number, size: number): number {
    return (address >> 2) & (size - 1);
  }

  private getTag(address: number, size: number): number {
    return address >> (2 + Math.log2(size));
  }

  private updateHitRate(isHit: boolean): void {
    const total = this.state.hitRate + this.state.missRate;
    const hits = (this.state.hitRate * total / 100) + (isHit ? 1 : 0);
    const total_new = total + 1;
    
    this.state.hitRate = (hits / total_new) * 100;
    this.state.missRate = 100 - this.state.hitRate;
  }

  public simulateRandomAccess(): void {
    const address = Math.floor(Math.random() * 65536);
    this.access(address, Math.random() > 0.5);
  }
}
