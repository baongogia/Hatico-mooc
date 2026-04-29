"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContactContextType {
  isOpen: boolean;
  type: 'consult' | 'quote';
  openContactModal: (type: 'consult' | 'quote') => void;
  closeContactModal: () => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'consult' | 'quote'>('consult');

  const openContactModal = (t: 'consult' | 'quote') => {
    setType(t);
    setIsOpen(true);
  };

  const closeContactModal = () => setIsOpen(false);

  return (
    <ContactContext.Provider value={{ isOpen, type, openContactModal, closeContactModal }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContactModal = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContactModal must be used within a ContactProvider');
  }
  return context;
};
