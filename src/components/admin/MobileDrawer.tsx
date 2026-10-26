import { useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { X } from "lucide-react";
import { NAV_GROUPS } from "./AdminSidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logoSrc: string;
}

export function MobileDrawer({ isOpen, onClose, logoSrc }: MobileDrawerProps) {
  const { pathname } = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    closeRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="at-dashboard-drawer-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="at-dashboard-drawer"
        ref={drawerRef}
        role="dialog"
        aria-label="Menu administrativo"
      >
        <div className="at-dashboard-drawer-header">
          <img src={logoSrc} alt="Armazém Tag Classificados" style={{ height: 32 }} />
          <button
            ref={closeRef}
            className="at-dashboard-drawer-close"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav aria-label="Menu administrativo" style={{ flex: 1, padding: "8px 0" }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="at-dashboard-nav-group">{group.title}</div>
              {group.items.map((item) => {
                const isActive = item.end ? pathname === item.to : pathname.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-active={isActive}
                    className="at-dashboard-nav-link"
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
