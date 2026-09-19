import { type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {title && <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>}
        {children}
        <button onClick={onClose} className="mt-4 text-sm text-gray-400 hover:text-gray-600">
          ✕ Fermer
        </button>
      </div>
    </div>
  );
}
