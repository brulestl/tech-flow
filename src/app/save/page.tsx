'use client'

import { useState } from 'react'
import SaveModal from '@/components/save/SaveModal'

export const metadata = {
  title: 'Save | TechVault',
  description: 'Save new resources to your knowledge base',
}

export default function Save() {
  const [isOpen, setIsOpen] = useState(true)

  return <SaveModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
} 