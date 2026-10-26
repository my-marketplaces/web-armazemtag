import { type ReactNode, type FormEvent } from "react";
import { X } from "lucide-react";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function PreviewDrawer({ open, onClose, title, children, footer }: DrawerProps) {
  if (!open) return null;

  return (
    <>
      <div className="prv-drawer-overlay" onClick={onClose} />
      <aside className="prv-drawer" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="prv-drawer-header">
          <h3 className="prv-drawer-title">{title}</h3>
          <button className="prv-drawer-close" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="prv-drawer-body">{children}</div>
        {footer && <div className="prv-drawer-footer">{footer}</div>}
      </aside>
    </>
  );
}

export function DrawerForm({ children, onSubmit }: { children: ReactNode; onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form className="prv-form" onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export function FormField({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="prv-form-field">
      <span>{label}</span>
      {children}
      {error && <span className="prv-form-error">{error}</span>}
    </label>
  );
}

export function FormRow({ children, cols }: { children: ReactNode; cols?: 2 | 3 }) {
  return <div className={`prv-form-row${cols === 3 ? " prv-form-row--3" : ""}`}>{children}</div>;
}

export function DrawerActions({ children }: { children: ReactNode }) {
  return <div className="prv-form-actions">{children}</div>;
}
