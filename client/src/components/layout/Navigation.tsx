import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Cpu, BarChart2, Layers } from 'lucide-react';

const Navigation: React.FC = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 border-b bg-background z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Cpu className="h-8 w-8" />
            <span className="text-xl font-bold">CPU Architecture Portfolio</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button 
                variant={location === '/' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <Layers className="h-4 w-4" />
                Overview
              </Button>
            </Link>
            
            <Link href="/architecture">
              <Button 
                variant={location === '/architecture' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <Cpu className="h-4 w-4" />
                Architecture
              </Button>
            </Link>
            
            <Link href="/performance">
              <Button 
                variant={location === '/performance' ? 'default' : 'ghost'}
                className="flex items-center gap-2"
              >
                <BarChart2 className="h-4 w-4" />
                Performance
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
