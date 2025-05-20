'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, Brain, Calendar, Zap } from 'lucide-react';

export default function MetricsComparison() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  const metrics = [
    {
      icon: <Clock className="h-6 w-6 text-accent-purple" />,
      metric: "Average snippet retrieval time",
      before: "5+ min",
      after: "< 10 sec",
    },
    {
      icon: <Brain className="h-6 w-6 text-accent-purple" />,
      metric: "Knowledge retention rate",
      before: "~20% (1 week)",
      after: "~80% (1 week)",
    },
    {
      icon: <Calendar className="h-6 w-6 text-accent-purple" />,
      metric: "Weekly deep-work hours",
      before: "X hrs",
      after: "X + 30%",
    },
    {
      icon: <Zap className="h-6 w-6 text-accent-purple" />,
      metric: "Context-switching time lost",
      before: "90%",
      after: "0%",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-24 bg-muted bg-opacity-30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why You'll Build Faster</h2>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-4xl mx-auto"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-6 text-left">Metric</th>
                  <th className="py-4 px-6 text-center">Before</th>
                  <th className="py-4 px-6 text-center">After</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((item, i) => (
                  <motion.tr 
                    key={i}
                    variants={itemVariants}
                    className="border-b border-border"
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-accent-purple bg-opacity-10">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.metric}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center text-muted-foreground">
                      {item.before}
                    </td>
                    <td className="py-6 px-6 text-center font-bold text-accent-purple">
                      {item.after}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
