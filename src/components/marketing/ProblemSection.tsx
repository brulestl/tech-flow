'use client';

import { motion } from 'framer-motion';
import { Bookmark, X, Layers } from 'lucide-react';

export default function ProblemSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      }
    })
  };

  const problems = [
    {
      icon: <Bookmark className="h-6 w-6 text-accent-purple" />,
      text: "You bookmark that perfect snippet on X and never see it again."
    },
    {
      icon: <X className="h-6 w-6 text-accent-purple" />,
      text: "Tutorials pile up in your browser tabs—then you close them, never to return."
    },
    {
      icon: <Layers className="h-6 w-6 text-accent-purple" />,
      text: "Clunky tag folders and scattered notes kill your flow."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Problem: Inspiration Lost</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
              className="bg-card p-6 rounded-xl border border-border shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-accent-purple bg-opacity-10">
                  {problem.icon}
                </div>
                <p className="text-lg">{problem.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
