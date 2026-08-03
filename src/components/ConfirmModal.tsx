import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'error';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ 
  isOpen, 
  title, 
  description, 
  confirmText = "Konfirmo", 
  cancelText = "Anulo", 
  confirmVariant = 'primary',
  onConfirm, 
  onCancel 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-surface-container rounded-2xl p-6 max-w-sm w-full shadow-[0px_20px_40px_rgba(0,0,0,0.2)] border border-outline-variant/20 flex flex-col gap-4">
        <h3 className="font-ui-header text-xl text-on-surface">{title}</h3>
        <p className="text-on-surface-variant text-sm">
          {description}
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2 rounded-full font-ui-button text-sm text-on-surface hover:bg-surface-variant transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full font-ui-button text-sm transition-colors shadow-sm ${
              confirmVariant === 'error'
                ? 'bg-error-container text-error hover:bg-error hover:text-white'
                : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
