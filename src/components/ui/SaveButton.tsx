"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import SaveModal from "@/components/features/SaveModal"

export default function SaveButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <>
      <motion.button
        className="fixed bottom-20 right-6 md:bottom-6 md:right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={24} />
      </motion.button>
      
      <AnimatePresence>
        {isModalOpen && (
          <SaveModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
