import * as React from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Toast Component
 *
 * Displays temporary notification messages.
 * Use ToastProvider and useToast hook for global toast management.
 *
 * @example
 * const { toast } = useToast();
 * toast({ title: "Success", description: "Project created", variant: "success" });
 */

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const toastWithId = { id, ...newToast };

    setToasts((prev) => [...prev, toastWithId]);

    // Auto dismiss after duration (default 5 seconds)
    const duration = newToast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const variantStyles = {
    default: {
      bg: 'bg-white',
      border: 'border-neutral-200',
      icon: null,
      iconColor: '',
    },
    success: {
      bg: 'bg-success-light',
      border: 'border-success-main',
      icon: CheckCircle2,
      iconColor: 'text-success-dark',
    },
    error: {
      bg: 'bg-error-light',
      border: 'border-error-main',
      icon: AlertCircle,
      iconColor: 'text-error-dark',
    },
    warning: {
      bg: 'bg-warning-light',
      border: 'border-warning-main',
      icon: AlertTriangle,
      iconColor: 'text-warning-dark',
    },
    info: {
      bg: 'bg-info-light',
      border: 'border-info-main',
      icon: Info,
      iconColor: 'text-info-dark',
    },
  };

  const variant = variantStyles[toast.variant || 'default'];
  const Icon = variant.icon;

  return (
    <div
      className={cn(
        'pointer-events-auto rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full',
        variant.bg,
        variant.border
      )}
    >
      <div className="flex gap-3">
        {Icon && <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', variant.iconColor)} />}
        <div className="flex-1">
          {toast.title && (
            <div className="font-semibold text-neutral-900 text-sm">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm text-neutral-700 mt-1">{toast.description}</div>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export { ToastContainer, ToastItem };
export default ToastProvider;
