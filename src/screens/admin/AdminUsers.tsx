export function AdminUsers() {
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
            <h2>Cadastros</h2>
            <p>Gerencie os usuários cadastrados na plataforma.</p>
          </div>
        </header>
        <div className="at-admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Papel</th>
                <th>Cadastro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}>
                  <div className="at-admin-empty">
                    Nenhum cadastro para exibir. Os dados aparecerão após a integração com
                    autenticação.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="at-admin-footer">Armazém Tag · AE Consultoria</footer>
    </>
  );
}
