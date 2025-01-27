import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Cpu, Code, BarChart2, Layers } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            RISC-V CPU Architecture Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive visualization and simulation of a modern RISC-V CPU implementation,
            featuring pipeline analysis, cache behavior, and performance metrics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="mb-4">
              <Cpu className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">CPU Architecture</h2>
            <p className="text-muted-foreground mb-4">
              Complete RV32I implementation with advanced pipelining and cache hierarchy.
            </p>
            <Link href="/architecture">
              <Button className="w-full">
                Explore Architecture
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <Code className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Pipeline Visualization</h2>
            <p className="text-muted-foreground mb-4">
              Real-time visualization of instruction flow and hazard detection.
            </p>
            <Link href="/architecture">
              <Button className="w-full" variant="secondary">
                View Pipeline
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <BarChart2 className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Performance Analysis</h2>
            <p className="text-muted-foreground mb-4">
              Comprehensive metrics and analysis of CPU performance characteristics.
            </p>
            <Link href="/performance">
              <Button className="w-full" variant="secondary">
                View Metrics
              </Button>
            </Link>
          </Card>
        </div>

        <Card className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  RV32I Base Integer Instruction Set
                </li>
                <li className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  5-Stage Pipeline Implementation
                </li>
                <li className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  L1/L2 Cache Hierarchy
                </li>
                <li className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Dynamic Branch Prediction
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Real-time Simulation
                </li>
                <li className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Interactive Visualizations
                </li>
                <li className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Performance Monitoring
                </li>
                <li className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Hazard Detection
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
