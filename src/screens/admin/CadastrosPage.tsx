import { useState, useEffect, useRef, type FormEvent } from "react";
import { X, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { usePreview } from "@/context/PreviewContext";
import type { CadastroRow } from "@/context/PreviewContext";
import "@/styles/cadastros-page.css";

type FormState = {
  tipo: "PF" | "PJ";
  nome: string;
  razaoSocial: string;
  nomeFantasia: string;
  documento: string;
  email: string;
  telefone: string;
  atividade: "Comércio" | "Serviço" | "Comércio e serviço";
  categoriaId: string;
  situacao: string;
};

const SITUACOES = ["Ativo", "Inativo", "Suspenso"];
const PAGE_SIZES = [10, 20, 50];

function maskDoc(doc: string): string {
  const digits = doc.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
  }
  if (digits.length === 14) {
    return `${digits.slice(0, 2)}.***.***/****-${digits.slice(12)}`;
  }
  return doc;
}

function genId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function hoje(): string {
  return new Date().toLocaleDateString("pt-BR");
}

export default function CadastrosPage() {
  const preview = usePreview();
  const dialogRef = useRef<HTMLDivElement>(null);

  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"" | "PF" | "PJ">("");
  const [situacaoFiltro, setSituacaoFiltro] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pagina, setPagina] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editando, setEditando] = useState<CadastroRow | null>(null);
  const [viewing, setViewing] = useState<CadastroRow | null>(null);

  const [form, setForm] = useState<FormState>({
    tipo: "PF",
    nome: "",
    razaoSocial: "",
    nomeFantasia: "",
    documento: "",
    email: "",
    telefone: "",
    atividade: "Comércio",
    categoriaId: "",
    situacao: "Ativo",
  });

  const [deleteConfirm, setDeleteConfirm] = useState<CadastroRow | null>(null);
  const [saveConfirm, setSaveConfirm] = useState(false);

  useEffect(() => {
    if (drawerOpen || deleteConfirm) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setDrawerOpen(false);
          setDeleteConfirm(null);
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [drawerOpen, deleteConfirm]);

  useEffect(() => {
    if (drawerOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [drawerOpen]);

  const registros = preview.cadastros;

  const filtrados = registros.filter((r) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca =
      !termo ||
      r.nome.toLowerCase().includes(termo) ||
      r.email.toLowerCase().includes(termo) ||
      r.documento.toLowerCase().includes(termo);
    const matchTipo = !tipoFiltro || r.tipo === tipoFiltro;
    const matchSituacao = !situacaoFiltro || r.situacao === situacaoFiltro;
    return matchBusca && matchTipo && matchSituacao;
  });

  const total = filtrados.length;
  const paginas = Math.max(1, Math.ceil(total / pageSize));
  const paginaAtual = Math.min(pagina, paginas);
  const inicio = (paginaAtual - 1) * pageSize;
  const fim = Math.min(inicio + pageSize, total);
  const exibidos = filtrados.slice(inicio, inicio + pageSize);

  function resetPagina() {
    setPagina(1);
  }

  function abrirNovo() {
    setEditando(null);
    setViewing(null);
    setForm({
      tipo: "PF",
      nome: "",
      razaoSocial: "",
      nomeFantasia: "",
      documento: "",
      email: "",
      telefone: "",
      atividade: "Comércio",
      categoriaId: "",
      situacao: "Ativo",
    });
    setDrawerOpen(true);
    setSaveConfirm(false);
  }

  function abrirEdicao(r: CadastroRow) {
    setEditando(r);
    setViewing(null);
    const catId = r.categoriaId && categoriaCompativel(r.categoriaId, r.atividade) ? r.categoriaId : "";
    setForm({
      tipo: r.tipo,
      nome: r.tipo === "PF" ? r.nome : "",
      razaoSocial: r.tipo === "PJ" ? r.nome : "",
      nomeFantasia: r.tipo === "PJ" ? r.nome : "",
      documento: r.documento,
      email: r.email,
      telefone: r.telefone,
      atividade: r.atividade,
      categoriaId: catId,
      situacao: r.situacao,
    });
    setDrawerOpen(true);
    setSaveConfirm(false);
  }

  function abrirVisualizacao(r: CadastroRow) {
    setViewing(r);
    setDrawerOpen(true);
  }

  function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saveConfirm) {
      const agora = hoje();
      if (editando) {
        preview.updateCadastro(editando.id, {
          tipo: form.tipo,
          nome: form.tipo === "PF" ? form.nome : form.razaoSocial || form.nomeFantasia,
          documento: maskDoc(form.documento),
          email: form.email,
          telefone: form.telefone,
          atividade: form.atividade,
          categoriaId: form.categoriaId || undefined,
          situacao: form.situacao,
        });
      } else {
        preview.addCadastro({
          tipo: form.tipo,
          nome: form.tipo === "PF" ? form.nome : form.razaoSocial || form.nomeFantasia,
          documento: maskDoc(form.documento),
          email: form.email,
          telefone: form.telefone,
          situacao: form.situacao,
          atividade: form.atividade,
          categoriaId: form.categoriaId || undefined,
          planoId: "",
        });
      }
      setDrawerOpen(false);
      setEditando(null);
      setSaveConfirm(false);
      resetPagina();
    } else {
      setSaveConfirm(true);
    }
  }

  function confirmarExclusao() {
    if (deleteConfirm) {
      preview.removeCadastro(deleteConfirm.id);
      setDeleteConfirm(null);
      if (inicio >= preview.cadastros.filter((r) => {
        const termo = busca.trim().toLowerCase();
        const matchBusca = !termo || r.nome.toLowerCase().includes(termo) || r.email.toLowerCase().includes(termo);
        const matchTipo = !tipoFiltro || r.tipo === tipoFiltro;
        const matchSituacao = !situacaoFiltro || r.situacao === situacaoFiltro;
        return matchBusca && matchTipo && matchSituacao;
      }).length && paginaAtual > 1) {
        setPagina(paginaAtual - 1);
      }
    }
  }

  function getPlanoNome(planoId: string): string {
    if (!planoId) return "Sem plano";
    const plano = preview.planos.find((p) => p.id === planoId);
    return plano ? plano.nome : "Sem plano";
  }

  function getCategoriaNome(categoriaId: string): string {
    if (!categoriaId) return "Sem categoria";
    const categoria = preview.categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nome : "Categoria removida";
  }

  function categoriasCompativeis(atividade: FormState["atividade"]) {
    return preview.categorias.filter(
      (c) =>
        c.situacao === "Ativa" &&
        (c.tipoAtividade === atividade ||
          c.tipoAtividade === "Comércio e serviço" ||
          atividade === "Comércio e serviço")
    );
  }

  function categoriaCompativel(categoriaId: string, atividade: FormState["atividade"]): boolean {
    if (!categoriaId) return true;
    const categoria = preview.categorias.find((c) => c.id === categoriaId);
    if (!categoria) return false;
    return (
      categoria.tipoAtividade === atividade ||
      categoria.tipoAtividade === "Comércio e serviço" ||
      atividade === "Comércio e serviço"
    );
  }

  return (
    <section className="cad-page">
      <div className="cad-panel">
        <div className="cad-toolbar">
          <label className="cad-search">
            <input
              type="search"
              placeholder="Buscar por nome, e-mail ou documento"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); resetPagina(); }}
            />
          </label>

          <label>
            <select
              value={tipoFiltro}
              onChange={(e) => { setTipoFiltro(e.target.value as "" | "PF" | "PJ"); resetPagina(); }}
            >
              <option value="">Tipo</option>
              <option value="PF">Pessoa física</option>
              <option value="PJ">Pessoa jurídica</option>
            </select>
          </label>

          <label>
            <select
              value={situacaoFiltro}
              onChange={(e) => { setSituacaoFiltro(e.target.value); resetPagina(); }}
            >
              <option value="">Situação</option>
              {SITUACOES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <button className="cad-new" onClick={abrirNovo}>
            <Plus size={15} strokeWidth={1.7} /> Novo cadastro
          </button>
        </div>

        <div className="cad-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Tipo</th>
                <th scope="col">Nome</th>
                <th scope="col">Plano</th>
                <th scope="col">Atividade</th>
                <th scope="col">Data de adesão</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {exibidos.length > 0 ? (
                exibidos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.tipo === "PF" ? "Pessoa física" : "Pessoa jurídica"}</td>
                    <td>{item.nome}</td>
                    <td>{getPlanoNome(item.planoId)}</td>
                    <td>{item.atividade}</td>
                    <td>{item.criadoEm}</td>
                    <td>
                      <div className="cad-row-actions">
                        <button onClick={() => abrirVisualizacao(item)} aria-label={`Ver ${item.nome}`}>
                          <Eye size={15} strokeWidth={1.7} />
                        </button>
                        <button onClick={() => abrirEdicao(item)} aria-label={`Editar ${item.nome}`}>
                          <Pencil size={15} strokeWidth={1.7} />
                        </button>
                        <button onClick={() => setDeleteConfirm(item)} aria-label={`Excluir ${item.nome}`}>
                          <Trash2 size={15} strokeWidth={1.7} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="cad-empty">
                      <span>Nenhum cadastro adicionado nesta prévia. Clique em <strong>Novo cadastro</strong> para começar.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="cad-pagination">
          <span>{total > 0 ? `${inicio + 1}–${fim} de ${total}` : "0 registros"}</span>
          <div className="cad-pagination-controls">
            <label>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); resetPagina(); }}
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s} por página</option>
                ))}
              </select>
            </label>
            <button disabled={paginaAtual <= 1} onClick={() => setPagina(paginaAtual - 1)}>
              Anterior
            </button>
            <span> Página {paginaAtual} de {paginas} </span>
            <button disabled={paginaAtual >= paginas} onClick={() => setPagina(paginaAtual + 1)}>
              Próxima
            </button>
          </div>
        </footer>
      </div>

      {drawerOpen && !viewing && (
        <div className="cad-modal-overlay" onClick={() => { setDrawerOpen(false); setSaveConfirm(false); }}>
          <aside
            className="cad-modal"
            role="dialog"
            aria-label={editando ? "Editar cadastro" : "Novo cadastro"}
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cad-modal-header">
              <h3>{editando ? "Editar cadastro" : "Novo cadastro"}</h3>
              <button className="cad-modal-close" onClick={() => { setDrawerOpen(false); setSaveConfirm(false); }} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <form className="cad-modal-form" onSubmit={salvar}>
              <fieldset className="cad-modal-fieldset">
                <legend>Tipo</legend>
                <div className="cad-modal-radio-group">
                  <label className="cad-modal-radio">
                    <input type="radio" name="tipo" checked={form.tipo === "PF"} onChange={() => setForm((f) => ({ ...f, tipo: "PF" }))} />
                    Pessoa física
                  </label>
                  <label className="cad-modal-radio">
                    <input type="radio" name="tipo" checked={form.tipo === "PJ"} onChange={() => setForm((f) => ({ ...f, tipo: "PJ" }))} />
                    Pessoa jurídica
                  </label>
                </div>
              </fieldset>

              {form.tipo === "PF" ? (
                <label className="cad-modal-field">
                  <span>Nome completo</span>
                  <input type="text" required value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
                </label>
              ) : (
                <>
                  <label className="cad-modal-field">
                    <span>Razão social</span>
                    <input type="text" required value={form.razaoSocial} onChange={(e) => setForm((f) => ({ ...f, razaoSocial: e.target.value }))} />
                  </label>
                  <label className="cad-modal-field">
                    <span>Nome fantasia</span>
                    <input type="text" value={form.nomeFantasia} onChange={(e) => setForm((f) => ({ ...f, nomeFantasia: e.target.value }))} />
                  </label>
                </>
              )}

              <label className="cad-modal-field">
                <span>{form.tipo === "PF" ? "CPF" : "CNPJ"}</span>
                <input type="text" required value={form.documento} onChange={(e) => setForm((f) => ({ ...f, documento: e.target.value }))} />
              </label>

              <label className="cad-modal-field">
                <span>E-mail</span>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </label>

              <label className="cad-modal-field">
                <span>Telefone</span>
                <input type="tel" value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} />
              </label>

              <label className="cad-modal-field">
                <span>Atividade</span>
                <select value={form.atividade} onChange={(e) => {
                  const novaAtividade = e.target.value as FormState["atividade"];
                  setForm((f) => {
                    const catValida = f.categoriaId && categoriaCompativel(f.categoriaId, novaAtividade);
                    return { ...f, atividade: novaAtividade, categoriaId: catValida ? f.categoriaId : "" };
                  });
                }}>
                  <option value="Comércio">Comércio</option>
                  <option value="Serviço">Serviço</option>
                  <option value="Comércio e serviço">Comércio e serviço</option>
                </select>
              </label>

              <label className="cad-modal-field">
                <span>Categoria</span>
                <select value={form.categoriaId} onChange={(e) => setForm((f) => ({ ...f, categoriaId: e.target.value }))}>
                  <option value="">Sem categoria</option>
                  {categoriasCompativeis(form.atividade).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.tipoAtividade})
                    </option>
                  ))}
                </select>
              </label>

              <label className="cad-modal-field">
                <span>Situação</span>
                <select value={form.situacao} onChange={(e) => setForm((f) => ({ ...f, situacao: e.target.value }))}>
                  {SITUACOES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <div className="cad-modal-actions">
                <button type="button" className="cad-modal-btn cad-modal-btn--ghost" onClick={() => { setDrawerOpen(false); setSaveConfirm(false); }}>
                  {saveConfirm ? "Cancelar" : "Cancelar"}
                </button>
                <button type="submit" className="cad-modal-btn cad-modal-btn--primary">
                  {saveConfirm ? "Confirmar alterações" : "Salvar"}
                </button>
              </div>
              {saveConfirm && <p className="cad-save-confirm">Deseja salvar as alterações neste cadastro?</p>}
            </form>
          </aside>
        </div>
      )}

      {drawerOpen && viewing && (
        <div className="cad-modal-overlay" onClick={() => setDrawerOpen(false)}>
          <aside
            className="cad-modal"
            role="dialog"
            aria-label={`Visualizar ${viewing.nome}`}
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cad-modal-header">
              <h3>{viewing.nome}</h3>
              <button className="cad-modal-close" onClick={() => setDrawerOpen(false)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="cad-modal-view">
              <dl>
                <dt>Tipo</dt>
                <dd>{viewing.tipo === "PF" ? "Pessoa física" : "Pessoa jurídica"}</dd>

                <dt>Nome</dt>
                <dd>{viewing.nome}</dd>

                <dt>Documento</dt>
                <dd>{viewing.documento}</dd>

                <dt>E-mail</dt>
                <dd>{viewing.email || "—"}</dd>

                <dt>Telefone</dt>
                <dd>{viewing.telefone || "—"}</dd>

                <dt>Atividade</dt>
                <dd>{viewing.atividade}</dd>

                <dt>Categoria</dt>
                <dd>{getCategoriaNome(viewing.categoriaId || "")}</dd>

                <dt>Plano</dt>
                <dd>{getPlanoNome(viewing.planoId)}</dd>

                <dt>Situação</dt>
                <dd>{viewing.situacao}</dd>

                <dt>Data de adesão</dt>
                <dd>{viewing.criadoEm}</dd>
              </dl>
            </div>

            <div className="cad-modal-actions">
              <button className="cad-modal-btn cad-modal-btn--primary" onClick={() => setDrawerOpen(false)}>
                Fechar
              </button>
            </div>
          </aside>
        </div>
      )}

      {deleteConfirm && (
        <div className="cad-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <aside
            className="cad-modal cad-modal--confirm"
            role="alertdialog"
            aria-label="Excluir cadastro"
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cad-modal-header">
              <h3>Excluir cadastro?</h3>
              <button className="cad-modal-close" onClick={() => setDeleteConfirm(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="cad-modal-confirm-body">
              <p>Deseja excluir o cadastro de <strong>{deleteConfirm.nome}</strong>?</p>
            </div>

            <div className="cad-modal-actions">
              <button className="cad-modal-btn cad-modal-btn--ghost" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button className="cad-modal-btn cad-modal-btn--danger" onClick={confirmarExclusao}>
                Confirmar exclusão
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
