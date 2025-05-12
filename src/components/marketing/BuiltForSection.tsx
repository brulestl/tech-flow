'use client';

import { motion } from 'framer-motion';
import { User, Users, Zap } from 'lucide-react';

export default function BuiltForSection() {
  const audiences = [
    {
      icon: <User className="h-8 w-8 text-accent-purple" />,
      title: "Solo Devs & Data Scientists",
      description: "who crave structure around inspiration."
    },
    {
      icon: <Users className="h-8 w-8 text-accent-purple" />,
      title: "Small Teams & Study Groups",
      description: "sharing curated vaults of code and concepts."
    },
    {
      icon: <Zap className="h-8 w-8 text-accent-purple" />,
      title: '"Vibe Coders"',
      description: "hunting flow, not clutter."
    }
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
    <section className="py-24 bg-muted bg-opacity-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Teams & Tinkerers</h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {audiences.map((audience, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-card p-8 rounded-xl border border-border shadow-sm flex flex-col items-center text-center"
            >
              <div className="p-4 rounded-full bg-accent-purple bg-opacity-10 mb-6">
                {audience.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{audience.title}</h3>
              <p className="text-muted-foreground">{audience.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
