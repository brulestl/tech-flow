'use client';

import { motion } from 'framer-motion';

export default function SolutionSection() {
  return (
    <section className="py-20 bg-muted bg-opacity-30">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Solution: Instant, Actionable Knowledge</h2>
          <p className="text-lg text-muted-foreground">
            Our app auto-tags, clusters, and converts your saved posts into interactive flashcards, 
            searchable snippets, and focused "Vibe-Coding" sprints—so you never lose a breakthrough.
          </p>
          
          <div className="mt-12">
            <motion.img 
              src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="TechVault app interface showing organized code snippets and flashcards"
              className="rounded-xl shadow-lg w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
