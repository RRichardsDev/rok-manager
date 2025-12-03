"use client";

import { Fragment, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <Fragment>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden pointer-events-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 sticky top-0 bg-slate-900">
            <h2 className="text-base font-semibold text-slate-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="px-4 py-4 overflow-y-auto max-h-[calc(85vh-56px)]">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  );

  return createPortal(modalContent, document.body);
}
