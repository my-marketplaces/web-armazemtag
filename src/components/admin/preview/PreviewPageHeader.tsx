import { type ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PreviewPageHeader({ title, description, actions }: Props) {
  return (
    <header className="prv-page-header">
      <div>
        <span className="prv-eyebrow">GESTÃO DA PLATAFORMA</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="prv-page-actions">{actions}</div>}
    </header>
  );
}
