"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Zap, Layers, Layout, Brain, DollarSign } from "lucide-react"

interface ClusterProps {
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

export default function ClusterPanel() {
  const [clusters] = useState<ClusterProps[]>([
    { 
      title: "React Hooks", 
      description: "useState, useEffect, custom hooks", 
      count: 12,
      icon: <Layers />,
      color: "var(--accent-purple)"
    },
    { 
      title: "CSS Flex & Grid", 
      description: "Layout techniques and tricks", 
      count: 8,
      icon: <Layout />,
      color: "var(--accent-blue)"
    },
    { 
      title: "UI Animations", 
      description: "CSS and JavaScript animations", 
      count: 5,
      icon: <Zap />,
      color: "var(--accent-pink)"
    },
    { 
      title: "TypeScript Types", 
      description: "Advanced type patterns", 
      count: 9,
      icon: <AlertCircle />,
      color: "var(--accent-cyan)" 
    },
    { 
      title: "Next.js Patterns", 
      description: "App router and server components", 
      count: 7,
      icon: <Brain />,
      color: "var(--accent-green)"
    }
  ])

  return (
    <div className="space-y-3">
      {clusters.map((cluster, index) => (
        <ClusterCard
          key={index}
          cluster={cluster}
        />
      ))}
      
      <motion.button
        className="w-full py-3 px-4 border border-dashed border-border rounded-xl text-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        Create new cluster
      </motion.button>
    </div>
  )
}

function ClusterCard({ cluster }: { cluster: ClusterProps }) {
  return (
    <motion.div
      className="p-4 rounded-xl border border-border hover:border-primary cursor-pointer bg-card hover:shadow-md transition-all"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start">
        <div 
          className="mr-3 p-2 rounded-md" 
          style={{ 
            backgroundColor: `${cluster.color}20`, // 20% opacity
            color: cluster.color 
          }}
        >
          {cluster.icon}
        </div>
        
        <div>
          <h3 className="font-medium">{cluster.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{cluster.description}</p>
          <p className="text-xs mt-1.5 font-medium">{cluster.count} resources</p>
        </div>
      </div>
    </motion.div>
  )
}
