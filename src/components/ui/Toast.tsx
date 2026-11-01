import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-[90%] max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const borderColors = {
    success: 'border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.3)]',
    info: 'border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]',
    warning: 'border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]'
  };

  return (
    <div
      className={`
        pointer-events-auto bg-[#0d0d1e]/95 backdrop-blur-md border px-4 py-2.5 rounded-xl
        text-white font-display text-sm font-semibold text-center
        animate-float shadow-xl ${borderColors[toast.type || 'info']}
      `}
    >
      {toast.text}
    </div>
  );
};

