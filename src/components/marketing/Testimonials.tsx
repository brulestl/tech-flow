'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sara',
    role: 'Data Scientist',
    quote: 'I cut my research time in half and actually remember the tutorials I save. My study group is finally on the same page.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  },
  {
    name: 'Raj',
    role: 'Full-Stack Engineer',
    quote: 'Vibe-Coding sessions keep me locked in—no more tab juggling, just pure focus.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }
];

export default function Testimonials() {
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
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-24 bg-background">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Results, Real Devs</h2>
      </div>
      
      <motion.div 
        className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {testimonials.map(t => (
          <motion.div 
            key={t.name} 
            className="rounded-2xl border border-border bg-card p-8 hover:shadow-md transition-all"
            variants={itemVariants}
          >
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <svg className="h-8 w-8 text-accent-purple" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="text-lg mb-6 flex-grow">{t.quote}</p>
              <div className="flex items-center gap-4">
                <img 
                  className="h-12 w-12 rounded-full object-cover"
                  src={t.avatar}
                  alt={`${t.name}'s avatar`}
                />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
