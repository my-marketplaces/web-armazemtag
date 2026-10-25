interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <>
      <div className="at-admin-toolbar">
        <span className="at-admin-eyebrow">CENTRAL DE GESTÃO</span>
        <label className="at-admin-period">
          Período
          <select disabled title="Disponível após integração dos dados">
            <option>Últimos 30 dias</option>
          </select>
        </label>
      </div>

      <section className="at-admin-panel">
        <header>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </header>
        <div className="at-admin-empty">
          <strong>Conteúdo indisponível</strong>
          <p>Este módulo será habilitado após a integração dos dados.</p>
        </div>
      </section>

      <footer className="at-admin-footer">Armazém Tag · AE Consultoria</footer>
    </>
  );
}
