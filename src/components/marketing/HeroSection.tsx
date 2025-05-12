'use client';

import { Button } from '@/components/ui/button';
import AnimatedFadeUp from './AnimatedFadeUp';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent-purple/20 to-accent-purple/5">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-24 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <AnimatedFadeUp>
            <h1 className="text-5xl font-bold tracking-tight md:text-[64px] leading-tight">
              Turn Saved Posts into <span className="text-accent-purple">Shippable Code</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Organize, learn, and build at warp speed with AI-powered workflows that capture every "aha" moment—and make it stick.
            </p>
            <div className="mt-8">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg transition-transform hover:scale-[1.03] hover:shadow-md"
              >
                Join the Beta →
              </Button>
            </div>
          </AnimatedFadeUp>
        </div>
        <motion.div 
          className="h-80 w-full rounded-xl bg-[url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)] bg-cover bg-center shadow-lg md:h-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          alt="Developer using TechVault to organize code snippets"
        />
      </div>
    </section>
  );
}
