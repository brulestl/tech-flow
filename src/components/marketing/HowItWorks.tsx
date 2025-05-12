'use client';

import { motion } from 'framer-motion';
import { Save, Brain, BookOpen, Clock } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Save className="h-8 w-8 text-accent-purple" />,
      title: "Capture Anywhere",
      description: "Save posts on X, Instagram, YouTube, and beyond with one click."
    },
    {
      icon: <Brain className="h-8 w-8 text-accent-purple" />,
      title: "AI-Smart Organization",
      description: "Auto-tagging and semantic clusters group related tips and code."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-accent-purple" />,
      title: "Learn & Apply",
      description: "Generate spaced-repetition flashcards and searchable code snippets."
    },
    {
      icon: <Clock className="h-8 w-8 text-accent-purple" />,
      title: "Vibe-Coding Sprints",
      description: "Dive into Pomodoro-style sessions with built-in playlists and templates."
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
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-card p-8 rounded-xl border border-border shadow-sm flex flex-col items-center text-center"
            >
              <div className="p-4 rounded-full bg-accent-purple bg-opacity-10 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              <div className="mt-6 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-accent-purple text-white flex items-center justify-center font-bold">
                  {i + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 flex justify-center">
          <div className="h-1 bg-accent-purple bg-opacity-20 w-full max-w-md rounded-full overflow-hidden">
            <div className="h-full bg-accent-purple w-3/4 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
