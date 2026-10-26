type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PreviewEmpty({ title, description, action }: Props) {
  return (
    <div className="prv-empty">
      <strong>{title}</strong>
      {description && <span>{description}</span>}
      {action}
    </div>
  );
}
