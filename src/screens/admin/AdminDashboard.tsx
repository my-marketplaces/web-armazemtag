import "../../styles/admin-dashboard.css"
import { useNavigate } from "@tanstack/react-router"

const IconOverview = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
)

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

const IconStore = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
    <path d="M2 7h20"></path>
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"></path>
  </svg>
)

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
)

const IconLifeBuoy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="4"></circle>
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
    <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
  </svg>
)

const IconCreditCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
)

const IconMegaphone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3 11 18-5v12L3 14v-3z"></path>
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
  </svg>
)

const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
)

const IconDollar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
)

const IconUsersCog = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <circle cx="19" cy="11" r="2"></circle>
    <path d="M19 8v1"></path>
    <path d="M19 13v1"></path>
    <path d="M21.6 9.5l-.87.5"></path>
    <path d="M17.27 12l-.87.5"></path>
    <path d="M21.6 12.5l-.87-.5"></path>
    <path d="M17.27 10l-.87-.5"></path>
  </svg>
)

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6M1 12h6m6 0h6"></path>
    <path d="m4.22 4.22 4.24 4.24m7.08 7.08 4.24 4.24M4.22 19.78l4.24-4.24m7.08-7.08 4.24-4.24"></path>
  </svg>
)

const IconFileSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <circle cx="11.5" cy="14.5" r="2.5"></circle>
    <line x1="13.5" y1="16.5" x2="16" y2="19"></line>
  </svg>
)

const menuIcons: Record<string, JSX.Element> = {
  "Visão geral": <IconOverview />,
  "Cadastros": <IconUsers />,
  "Lojas e serviços": <IconStore />,
  "Segurança": <IconShield />,
  "Suporte": <IconLifeBuoy />,
  "Planos e assinaturas": <IconCreditCard />,
  "Anúncios e destaques": <IconMegaphone />,
  "Indicações": <IconShare />,
  "Financeiro": <IconDollar />,
  "Equipe e permissões": <IconUsersCog />,
  "Configurações": <IconSettings />,
  "Auditoria": <IconFileSearch />,
}

const groups = [
  {
    title: "Principal",
    items: ["Visão geral"],
  },
  {
    title: "Operação",
    items: ["Cadastros", "Lojas e serviços", "Segurança", "Suporte"],
  },
  {
    title: "Comercial",
    items: ["Planos e assinaturas", "Anúncios e destaques", "Indicações"],
  },
  {
    title: "Administração",
    items: ["Financeiro", "Equipe e permissões", "Configurações", "Auditoria"],
  },
]

type Props = {
  logoSrc: string
  onNavigate?: (module: string) => void
}

export function AdminDashboard({ logoSrc, onNavigate }: Props) {
  const navigate = useNavigate()

  const handleNavigate = (module: string) => {
    if (onNavigate) {
      onNavigate(module)
      return
    }

    const routeMap: Record<string, string> = {
      "Visão geral": "/admin",
      "Cadastros": "/admin/cadastros",
      "Lojas e serviços": "/admin/lojas",
      "Segurança": "/admin/seguranca",
      "Suporte": "/admin/suporte",
      "Planos e assinaturas": "/admin/planos",
      "Anúncios e destaques": "/admin/anuncios",
      "Indicações": "/admin/indicacoes",
      "Financeiro": "/admin/financeiro",
      "Equipe e permissões": "/admin/equipe",
      "Configurações": "/admin/configuracoes",
      "Auditoria": "/admin/auditoria",
    }

    const route = routeMap[module]
    if (route) {
      navigate({ to: route })
    } else {
      window.alert("Módulo indisponível nesta versão.")
    }
  }

  return (
    <div className="at-admin">
      <aside className="at-admin-sidebar">
        <div className="at-admin-sidebar-brand">
          <img src={logoSrc} alt="Armazém Tag Classificados" />
        </div>

        <nav aria-label="Navegação administrativa">
          {groups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={item === "Visão geral" ? "is-active" : ""}
                  aria-current={item === "Visão geral" ? "page" : undefined}
                  onClick={() => handleNavigate(item)}
                >
                  <span className="at-admin-menu-icon">{menuIcons[item]}</span>
                  <span>{item}</span>
                </button>
              ))}
            </section>
          ))}
        </nav>

        <footer>
          <strong>AE Consultoria</strong>
          <small>Administração da plataforma</small>
        </footer>
      </aside>

      <header className="at-admin-topbar">
        <span className="at-admin-header-label">Painel administrativo</span>

        <div className="at-admin-account">
          <span className="at-admin-preview">Prévia</span>
          <span className="at-admin-avatar" aria-hidden="true">
            V
          </span>
          <div>
            <strong>Visitante</strong>
            <small>Ambiente de desenvolvimento</small>
          </div>
        </div>
      </header>

      <main className="at-admin-main" id="admin-content">
        <div className="at-admin-toolbar">
          <span className="at-admin-eyebrow">CENTRAL DE GESTÃO</span>

          <label className="at-admin-period">
            Período
            <select disabled title="Disponível após integração dos dados">
              <option>Últimos 30 dias</option>
            </select>
          </label>
        </div>

        <section className="at-admin-stats" aria-label="Indicadores">
          {[
            ["Cadastros", "Pessoas e empresas"],
            ["Lojas ativas", "Estabelecimentos da plataforma"],
            ["Assinaturas", "Contratos ativos"],
            ["Anúncios", "Campanhas em exibição"],
          ].map(([title, description]) => (
            <article key={title}>
              <span>{title}</span>
              <strong>—</strong>
              <small>{description}</small>
            </article>
          ))}
        </section>

        <div className="at-admin-content-grid">
          <section className="at-admin-panel">
            <header>
              <div>
                <h2>Pendências operacionais</h2>
                <p>Organize o que precisa da sua atenção.</p>
              </div>
              <span className="at-admin-chip">Operação</span>
            </header>

            <div className="at-admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fila de trabalho</th>
                    <th>Quantidade</th>
                    <th>Acesso</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Denúncias para análise", "Segurança"],
                    ["Chamados de atendimento", "Suporte"],
                    ["Campanhas para revisão", "Anúncios e destaques"],
                  ].map(([title, module]) => (
                    <tr key={title}>
                      <td>{title}</td>
                      <td>—</td>
                      <td>
                        <button type="button" onClick={() => handleNavigate(module)}>
                          Consultar →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="at-admin-note">Quantidades indisponíveis na prévia.</p>
          </section>

          <section className="at-admin-panel">
            <header>
              <div>
                <h2>Acesso rápido</h2>
                <p>Rotinas administrativas.</p>
              </div>
            </header>

            <div className="at-admin-shortcuts">
              {["Cadastros", "Lojas e serviços", "Anúncios e destaques", "Suporte"].map((item) => (
                <button type="button" key={item} onClick={() => handleNavigate(item)}>
                  <span>{item}</span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="at-admin-panel at-admin-activity">
          <header>
            <div>
              <h2>Atividades recentes</h2>
              <p>Acompanhe as movimentações da equipe.</p>
            </div>
          </header>
          <div className="at-admin-empty">
            <strong>Nenhuma atividade disponível</strong>
            <p>O histórico será exibido após a integração dos dados.</p>
          </div>
        </section>

        <footer className="at-admin-footer">Armazém Tag · AE Consultoria</footer>
      </main>
    </div>
  )
}

export default AdminDashboard
