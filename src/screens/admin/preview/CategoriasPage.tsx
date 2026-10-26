import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  X,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Power,
  ImageIcon,
  Upload,
  Trash,
} from "lucide-react";
import { usePreview } from "@/context/PreviewContext";
import type { CategoriaRow } from "@/context/PreviewContext";
import "@/styles/categorias-page.css";

type AtividadeTipo = "Comércio" | "Serviço" | "Comércio e serviço";

type TabKey = "Todas" | AtividadeTipo;

const TABS: { key: TabKey; label: string }[] = [
  { key: "Todas", label: "Todas" },
  { key: "Comércio", label: "Comércio" },
  { key: "Serviço", label: "Serviço" },
  { key: "Comércio e serviço", label: "Comércio e serviço" },
];

const PAGE_SIZES = [10, 20, 50];
const IMAGEM_FORMATOS = ["image/jpeg", "image/png", "image/webp"];
const IMAGEM_LABEL_FORMATOS = "JPG, PNG ou WebP";

type FormState = {
  nome: string;
  tipoAtividade: AtividadeTipo;
  descricao: string;
  icone: string;
  imagem: string;
  ordem: number;
  situacao: "Ativa" | "Inativa";
};

export default function CategoriasPage() {
  const preview = usePreview();
  const drawerRef = useRef<HTMLDivElement>(null);

  const [busca, setBusca] = useState("");
  const [situacaoFiltro, setSituacaoFiltro] = useState("");
  const [tabAtiva, setTabAtiva] = useState<TabKey>("Todas");
  const [pageSize, setPageSize] = useState(10);
  const [pagina, setPagina] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editando, setEditando] = useState<CategoriaRow | null>(null);
  const [viewing, setViewing] = useState<CategoriaRow | null>(null);

  const [form, setForm] = useState<FormState>({
    nome: "",
    tipoAtividade: "Comércio",
    descricao: "",
    icone: "",
    imagem: "",
    ordem: 0,
    situacao: "Ativa",
  });

  const [erroImagem, setErroImagem] = useState("");
  const inputImagemRef = useRef<HTMLInputElement>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<CategoriaRow | null>(null);
  const [toggleConfirm, setToggleConfirm] = useState<{ row: CategoriaRow; target: "Ativa" | "Inativa" } | null>(null);
  const [saveConfirm, setSaveConfirm] = useState(false);

  useEffect(() => {
    if (drawerOpen || deleteConfirm || toggleConfirm) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setDrawerOpen(false);
          setDeleteConfirm(null);
          setToggleConfirm(null);
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [drawerOpen, deleteConfirm, toggleConfirm]);

  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [drawerOpen]);

  const registros = preview.categorias;

  const filtrados = registros.filter((r) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca = !termo || r.nome.toLowerCase().includes(termo);
    const matchSituacao = !situacaoFiltro || r.situacao === situacaoFiltro;
    const matchTab =
      tabAtiva === "Todas" || r.tipoAtividade === tabAtiva;
    return matchBusca && matchSituacao && matchTab;
  });

  const total = filtrados.length;
  const paginas = Math.max(1, Math.ceil(total / pageSize));
  const paginaAtual = Math.min(pagina, paginas);
  const inicio = (paginaAtual - 1) * pageSize;
  const exibidos = filtrados.slice(inicio, inicio + pageSize);

  function resetPagina() {
    setPagina(1);
  }

  function tipoFromTab(tab: TabKey): AtividadeTipo {
    return tab === "Todas" ? "Comércio" : tab;
  }

  function abrirNovo() {
    setEditando(null);
    setViewing(null);
    setForm({
      nome: "",
      tipoAtividade: tipoFromTab(tabAtiva),
      descricao: "",
      icone: "",
      imagem: "",
      ordem: preview.categorias.filter((c) => c.tipoAtividade === tipoFromTab(tabAtiva)).length,
      situacao: "Ativa",
    });
    setErroImagem("");
    setDrawerOpen(true);
    setSaveConfirm(false);
  }

  function abrirEdicao(r: CategoriaRow) {
    setEditando(r);
    setViewing(null);
    setForm({
      nome: r.nome,
      tipoAtividade: r.tipoAtividade,
      descricao: r.descricao,
      icone: r.icone,
      imagem: r.imagem ?? "",
      ordem: r.ordem,
      situacao: r.situacao,
    });
    setErroImagem("");
    setDrawerOpen(true);
    setSaveConfirm(false);
  }

  function abrirVisualizacao(r: CategoriaRow) {
    setViewing(r);
    setDrawerOpen(true);
  }

  function nomeDuplicado(nome: string, tipoAtividade: AtividadeTipo, ignoreId?: string): boolean {
    const normalized = nome.trim().toLowerCase();
    return preview.categorias.some(
      (c) =>
        c.id !== ignoreId &&
        c.tipoAtividade === tipoAtividade &&
        c.nome.trim().toLowerCase() === normalized
    );
  }

  function temVinculos(categoriaId: string): boolean {
    return (
      preview.cadastros.some((c) => c.categoriaId === categoriaId) ||
      preview.anuncios.some((a) => a.categoriaId === categoriaId) ||
      preview.destaques.some((d) => d.categoriaId === categoriaId)
    );
  }

  function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (nomeDuplicado(form.nome, form.tipoAtividade, editando?.id)) {
      return;
    }

    if (saveConfirm) {
      if (editando) {
        preview.updateCategoria(editando.id, {
          nome: form.nome.trim(),
          tipoAtividade: form.tipoAtividade,
          descricao: form.descricao.trim(),
          icone: form.icone,
          imagem: form.imagem || undefined,
          ordem: form.ordem,
          situacao: form.situacao,
        });
      } else {
        preview.addCategoria({
          nome: form.nome.trim(),
          tipoAtividade: form.tipoAtividade,
          descricao: form.descricao.trim(),
          icone: form.icone,
          imagem: form.imagem || undefined,
          ordem: form.ordem,
          situacao: form.situacao,
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

  function confirmarToggle() {
    if (toggleConfirm) {
      preview.updateCategoria(toggleConfirm.row.id, { situacao: toggleConfirm.target });
      setToggleConfirm(null);
      resetPagina();
    }
  }

  function confirmarExclusao() {
    if (deleteConfirm) {
      preview.removeCategoria(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  }

  function toggleSituacao(r: CategoriaRow) {
    const target = r.situacao === "Ativa" ? "Inativa" : "Ativa";
    setToggleConfirm({ row: r, target });
  }

  const duplicado =
    form.nome.trim().length > 0 && nomeDuplicado(form.nome, form.tipoAtividade, editando?.id);

  function handleImagemSelecionada(e: React.ChangeEvent<HTMLInputElement>) {
    setErroImagem("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!IMAGEM_FORMATOS.includes(file.type)) {
      setErroImagem(`Formato não aceito. Use ${IMAGEM_LABEL_FORMATOS}.`);
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imagem: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function removerImagem() {
    setForm((f) => ({ ...f, imagem: "" }));
    setErroImagem("");
    if (inputImagemRef.current) inputImagemRef.current.value = "";
  }

  return (
    <section className="cat-page">
      <div className="cat-panel">
        <div className="cat-toolbar">
          <label className="cat-search">
            <input
              type="search"
              placeholder="Buscar por nome"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); resetPagina(); }}
            />
          </label>

          <label>
            <select
              value={situacaoFiltro}
              onChange={(e) => { setSituacaoFiltro(e.target.value); resetPagina(); }}
            >
              <option value="">Situação</option>
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
            </select>
          </label>

          <button className="cat-new" onClick={abrirNovo}>
            <Plus size={15} strokeWidth={1.7} /> Nova categoria
          </button>
        </div>

        <div className="cat-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={tabAtiva === tab.key ? "cat-tab is-active" : "cat-tab"}
              onClick={() => { setTabAtiva(tab.key); resetPagina(); }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="cat-table-wrap">
          <table>
             <thead>
               <tr>
                 <th scope="col">Imagem</th>
                 <th scope="col">Nome da categoria</th>
                 {tabAtiva === "Todas" && <th scope="col">Tipo de atividade</th>}
                 <th scope="col">Situação</th>
                 <th scope="col">Ordem</th>
                 <th scope="col">Ações</th>
               </tr>
             </thead>
            <tbody>
              {exibidos.length > 0 ? (
                 exibidos.map((item) => {
                   return (
                     <tr key={item.id}>
                       <td>
                         {item.imagem ? (
                           <img className="cat-thumb" src={item.imagem} alt={item.nome} />
                         ) : (
                           <span className="cat-thumb-placeholder">
                             <ImageIcon size={16} strokeWidth={1.4} />
                           </span>
                         )}
                       </td>
                      <td>{item.nome}</td>
                      {tabAtiva === "Todas" && <td>{item.tipoAtividade}</td>}
                      <td>
                        <span className={`cat-badge ${item.situacao === "Ativa" ? "cat-badge--ativa" : "cat-badge--inativa"}`}>
                          {item.situacao}
                        </span>
                      </td>
                      <td>{item.ordem}</td>
                      <td>
                        <div className="cat-row-actions">
                          <button onClick={() => abrirVisualizacao(item)} aria-label={`Ver ${item.nome}`}>
                            <Eye size={15} strokeWidth={1.7} />
                          </button>
                          <button onClick={() => abrirEdicao(item)} aria-label={`Editar ${item.nome}`}>
                            <Pencil size={15} strokeWidth={1.7} />
                          </button>
                          <button onClick={() => toggleSituacao(item)} aria-label={`${item.situacao === "Ativa" ? "Desativar" : "Ativar"} ${item.nome}`}>
                            <Power size={15} strokeWidth={1.7} />
                          </button>
                          <button onClick={() => setDeleteConfirm(item)} aria-label={`Excluir ${item.nome}`}>
                            <Trash2 size={15} strokeWidth={1.7} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={tabAtiva === "Todas" ? 6 : 5}>
                    <div className="cat-empty">
                      <span>Nenhuma categoria adicionada nesta prévia. Clique em <strong>Nova categoria</strong> para começar.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="cat-pagination">
          <span>{total > 0 ? `${inicio + 1}–${Math.min(inicio + pageSize, total)} de ${total}` : "0 registros"}</span>
          <div className="cat-pagination-controls">
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
            <span>Página {paginaAtual} de {paginas}</span>
            <button disabled={paginaAtual >= paginas} onClick={() => setPagina(paginaAtual + 1)}>
              Próxima
            </button>
          </div>
        </footer>
      </div>

      {drawerOpen && !viewing && (
        <div className="cat-drawer-overlay" onClick={() => { setDrawerOpen(false); setSaveConfirm(false); }}>
          <aside
            className="cat-drawer"
            role="dialog"
            aria-label={editando ? "Editar categoria" : "Nova categoria"}
            tabIndex={-1}
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cat-drawer-header">
              <h3>{editando ? "Editar categoria" : "Nova categoria"}</h3>
              <button className="cat-drawer-close" onClick={() => { setDrawerOpen(false); setSaveConfirm(false); }} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <form className="cat-drawer-form" onSubmit={salvar}>
              <fieldset className="cat-fieldset">
                <legend>Tipo de atividade</legend>
                <div className="cat-radio-group">
                  {TABS.filter((t) => t.key !== "Todas").map((t) => (
                    <label key={t.key} className="cat-radio">
                      <input
                        type="radio"
                        name="tipoAtividade"
                        checked={form.tipoAtividade === t.key}
                        onChange={() => setForm((f) => ({ ...f, tipoAtividade: t.key as AtividadeTipo }))}
                      />
                      {t.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="cat-field">
                <span>Nome da categoria</span>
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                />
                {duplicado && <em className="cat-field-error">Já existe uma categoria com este nome neste grupo.</em>}
              </label>

              <label className="cat-field">
                <span>Descrição</span>
                <textarea
                  rows={3}
                  value={form.descricao}
                  onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                />
              </label>

              <fieldset className="cat-fieldset">
                <legend>Imagem da categoria</legend>
                {form.imagem ? (
                  <div className="cat-imagem-preview-wrap">
                    <div className="cat-imagem-preview">
                      <img src={form.imagem} alt={`Prévia de ${form.nome || "categoria"}`} />
                    </div>
                    <div className="cat-imagem-actions">
                      <button
                        type="button"
                        className="cat-btn cat-btn--ghost"
                        onClick={() => inputImagemRef.current?.click()}
                      >
                        <Upload size={13} /> Substituir
                      </button>
                      <button
                        type="button"
                        className="cat-btn cat-btn--ghost"
                        onClick={removerImagem}
                      >
                        <Trash size={13} /> Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="cat-imagem-upload" onClick={() => inputImagemRef.current?.click()}>
                    <ImageIcon size={22} strokeWidth={1.4} />
                    <span>Clique para enviar uma imagem</span>
                    <small>{IMAGEM_LABEL_FORMATOS}</small>
                  </div>
                )}
                <input
                  ref={inputImagemRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={handleImagemSelecionada}
                />
                {erroImagem && <em className="cat-field-error">{erroImagem}</em>}
              </fieldset>

              <div className="cat-field-row">
                <label className="cat-field cat-field--ordem">
                  <span>Ordem</span>
                  <input
                    type="number"
                    min={0}
                    value={form.ordem}
                    onChange={(e) => setForm((f) => ({ ...f, ordem: Number(e.target.value) }))}
                  />
                </label>

                <label className="cat-field">
                  <span>Situação</span>
                  <select
                    value={form.situacao}
                    onChange={(e) => setForm((f) => ({ ...f, situacao: e.target.value as "Ativa" | "Inativa" }))}
                  >
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                  </select>
                </label>
              </div>

              <div className="cat-drawer-actions">
                <button type="button" className="cat-btn cat-btn--ghost" onClick={() => { setDrawerOpen(false); setSaveConfirm(false); }}>
                  {saveConfirm ? "Voltar" : "Cancelar"}
                </button>
                <button type="submit" className="cat-btn cat-btn--primary" disabled={duplicado}>
                  {saveConfirm ? "Confirmar" : "Salvar"}
                </button>
              </div>
              {saveConfirm && <p className="cat-save-confirm">Deseja salvar esta categoria?</p>}
            </form>
          </aside>
        </div>
      )}

      {drawerOpen && viewing && (
        <div className="cat-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <aside
            className="cat-drawer"
            role="dialog"
            aria-label={`Visualizar ${viewing.nome}`}
            tabIndex={-1}
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cat-drawer-header">
              <h3>{viewing.nome}</h3>
              <button className="cat-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="cat-drawer-view">
               <div className="cat-view-imagem-wrap">
                 {viewing.imagem ? (
                   <img className="cat-view-imagem" src={viewing.imagem} alt={viewing.nome} />
                 ) : (
                   <div className="cat-view-imagem-placeholder">
                     <ImageIcon size={28} strokeWidth={1.4} />
                   </div>
                 )}
               </div>
              <dl>
                <dt>Tipo de atividade</dt>
                <dd>{viewing.tipoAtividade}</dd>

                <dt>Descrição</dt>
                <dd>{viewing.descricao || "—"}</dd>

                <dt>Ordem</dt>
                <dd>{viewing.ordem}</dd>

                <dt>Situação</dt>
                <dd>
                  <span className={`cat-badge ${viewing.situacao === "Ativa" ? "cat-badge--ativa" : "cat-badge--inativa"}`}>
                    {viewing.situacao}
                  </span>
                </dd>
              </dl>
            </div>

            <div className="cat-drawer-actions">
              <button className="cat-btn cat-btn--primary" onClick={() => setDrawerOpen(false)}>
                Fechar
              </button>
            </div>
          </aside>
        </div>
      )}

      {deleteConfirm && (
        <div className="cat-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <aside
            className="cat-modal cat-modal--confirm"
            role="alertdialog"
            aria-label="Excluir categoria"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cat-modal-header">
              <h3>Excluir categoria?</h3>
              <button className="cat-modal-close" onClick={() => setDeleteConfirm(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="cat-modal-confirm-body">
              {temVinculos(deleteConfirm.id) ? (
                <p>Não é possível excluir <strong>{deleteConfirm.nome}</strong> pois existem registros vinculados. Desative a categoria para mantê-la oculta sem perder os vínculos.</p>
              ) : (
                <p>Deseja excluir a categoria <strong>{deleteConfirm.nome}</strong>?</p>
              )}
            </div>

            <div className="cat-modal-actions">
              <button className="cat-btn cat-btn--ghost" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              {!temVinculos(deleteConfirm.id) && (
                <button className="cat-btn cat-btn--danger" onClick={confirmarExclusao}>
                  Confirmar exclusão
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {toggleConfirm && (
        <div className="cat-modal-overlay" onClick={() => setToggleConfirm(null)}>
          <aside
            className="cat-modal cat-modal--confirm"
            role="alertdialog"
            aria-label="Alterar situação"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cat-modal-header">
              <h3>{toggleConfirm.target === "Ativa" ? "Ativar" : "Desativar"} categoria?</h3>
              <button className="cat-modal-close" onClick={() => setToggleConfirm(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="cat-modal-confirm-body">
              <p>
                Deseja {toggleConfirm.target === "Ativa" ? "ativar" : "desativar"} a categoria <strong>{toggleConfirm.row.nome}</strong>?
              </p>
            </div>

            <div className="cat-modal-actions">
              <button className="cat-btn cat-btn--ghost" onClick={() => setToggleConfirm(null)}>
                Cancelar
              </button>
              <button className="cat-btn cat-btn--primary" onClick={confirmarToggle}>
                Confirmar
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
