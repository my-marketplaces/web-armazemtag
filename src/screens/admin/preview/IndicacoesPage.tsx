import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  X,
  Eye,
  Pencil,
  Plus,
  UserPlus,
  EyeOff,
  ShieldOff,
  type LucideIcon,
} from "lucide-react";
import { usePreview } from "@/context/PreviewContext";
import type { IndicadorRow, IndicacaoRow } from "@/context/PreviewContext";
import "@/styles/indicacoes-page.css";

const PAGE_SIZES = [10, 20, 50];

const PIX_TIPOS: { value: IndicadorRow["pixTipo"]; label: string }[] = [
  { value: "CPF", label: "CPF" },
  { value: "CNPJ", label: "CNPJ" },
  { value: "E-mail", label: "E-mail" },
  { value: "Telefone", label: "Telefone" },
  { value: "Aleatória", label: "Aleatória" },
];

type FormState = {
  cadastroId: string;
  nome: string;
  tipo: "PF" | "PJ";
  documento: string;
  telefone: string;
  email: string;
  pixTipo: IndicadorRow["pixTipo"];
  pixChave: string;
  pixTitularNome: string;
  pixTitularDocumento: string;
};

type IndicacaoForm = {
  indicadoId: string;
  situacao: IndicacaoRow["situacao"];
  comissao: number;
};

const COMISSAO_PADRAO = 10;

function maskCpfCnpj(value: string, tipo: "PF" | "PJ"): string {
  const digits = value.replace(/\D/g, "");
  if (tipo === "PF") {
    return digits
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function maskPixChave(value: string, tipo: IndicadorRow["pixTipo"]): string {
  const digits = value.replace(/\D/g, "");
  switch (tipo) {
    case "CPF":
      return maskCpfCnpj(digits, "PF");
    case "CNPJ":
      return maskCpfCnpj(digits, "PJ");
    case "Telefone":
      return maskPhone(value);
    default:
      return value;
  }
}

function maskDocumentoTable(doc: string, tipo: "PF" | "PJ"): string {
  const digits = doc.replace(/\D/g, "");
  if (tipo === "PF" && digits.length > 3) {
    return `***.${digits.slice(3, 6)}.***-**`;
  }
  if (tipo === "PJ" && digits.length > 2) {
    return `**.${digits.slice(2, 5)}.**/****-**`;
  }
  return doc;
}

function maskPixChaveView(chave: string): string {
  if (!chave) return "";
  if (chave.length <= 4) return "*".repeat(chave.length);
  return "*".repeat(chave.length - 4) + chave.slice(-4);
}

function formatBrl(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function defaultForm(): FormState {
  return {
    cadastroId: "",
    nome: "",
    tipo: "PF",
    documento: "",
    telefone: "",
    email: "",
    pixTipo: "CPF",
    pixChave: "",
    pixTitularNome: "",
    pixTitularDocumento: "",
  };
}

export default function IndicacoesPage() {
  const preview = usePreview();
  const drawerRef = useRef<HTMLDivElement>(null);

  const [busca, setBusca] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pagina, setPagina] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editando, setEditando] = useState<IndicadorRow | null>(null);
  const [viewing, setViewing] = useState<IndicadorRow | null>(null);

  const [form, setForm] = useState<FormState>(defaultForm());
  const [saveConfirm, setSaveConfirm] = useState(false);

  const [pixRevelado, setPixRevelado] = useState(false);
  const [indicacaoForm, setIndicacaoForm] = useState<IndicacaoForm>({
    indicadoId: "",
    situacao: "Pendente",
    comissao: COMISSAO_PADRAO,
  });
  const [showIndicacaoForm, setShowIndicacaoForm] = useState(false);

  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (drawerOpen) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setDrawerOpen(false);
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [drawerOpen]);

  const registros = preview.indicadores;

  const filtrados = registros.filter((r) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;
    return (
      r.nome.toLowerCase().includes(termo) ||
      r.documento.toLowerCase().includes(termo)
    );
  });

  const total = filtrados.length;
  const paginas = Math.max(1, Math.ceil(total / pageSize));
  const paginaAtual = Math.min(pagina, paginas);
  const inicio = (paginaAtual - 1) * pageSize;
  const exibidos = filtrados.slice(inicio, inicio + pageSize);

  function resetPagina() {
    setPagina(1);
  }

  function getTotais(indicadorId: string) {
    const vinculadas = preview.indicacoes.filter(
      (i) => i.indicadorId === indicadorId
    );
    const totalInd = vinculadas.length;
    const efetivadas = vinculadas.filter((i) => i.situacao === "Efetivada").length;
    const receber = vinculadas
      .filter((i) => i.situacao === "Efetivada" && i.comissaoSituacao === "A receber")
      .reduce((acc, i) => acc + i.comissao, 0);
    return { total: totalInd, efetivadas, receber };
  }

  function getNomeCadastro(id: string): string {
    const c = preview.cadastros.find((c) => c.id === id);
    return c ? c.nome : id;
  }

  function jaIndicado(indicadorId: string, indicadoId: string, ignoreId?: string): boolean {
    return preview.indicacoes.some(
      (i) =>
        i.id !== ignoreId &&
        i.indicadorId === indicadorId &&
        i.indicadoId === indicadoId
    );
  }

  function abrirNovo() {
    setEditando(null);
    setViewing(null);
    setForm(defaultForm());
    setDrawerOpen(true);
    setSaveConfirm(false);
    setPixRevelado(false);
    setShowIndicacaoForm(false);
  }

  function abrirEdicao(r: IndicadorRow) {
    setEditando(r);
    setViewing(null);
    setForm({
      cadastroId: r.cadastroId,
      nome: r.nome,
      tipo: r.tipo,
      documento: r.documento,
      telefone: r.telefone,
      email: r.email,
      pixTipo: r.pixTipo,
      pixChave: r.pixChave,
      pixTitularNome: r.pixTitularNome,
      pixTitularDocumento: r.pixTitularDocumento,
    });
    setDrawerOpen(true);
    setSaveConfirm(false);
    setPixRevelado(false);
    setShowIndicacaoForm(false);
  }

  function abrirVisualizacao(r: IndicadorRow) {
    setViewing(r);
    setEditando(null);
    setDrawerOpen(true);
    setPixRevelado(false);
    setShowIndicacaoForm(false);
    setIndicacaoForm({ indicadoId: "", situacao: "Pendente", comissao: COMISSAO_PADRAO });
  }

  function onSelectCadastro(cadastroId: string) {
    const c = preview.cadastros.find((c) => c.id === cadastroId);
    if (c) {
      setForm((f) => ({
        ...f,
        cadastroId: c.id,
        nome: c.nome,
        tipo: c.tipo,
        documento: c.documento,
        telefone: c.telefone,
        email: c.email,
      }));
    } else {
      setForm((f) => ({ ...f, cadastroId: "" }));
    }
  }

  function indicadorDuplicado(cadastroId: string, ignoreId?: string): boolean {
    if (!cadastroId) return false;
    return preview.indicadores.some(
      (i) => i.id !== ignoreId && i.cadastroId === cadastroId
    );
  }

  function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (indicadorDuplicado(form.cadastroId, editando?.id)) return;

    if (saveConfirm) {
      if (editando) {
        preview.updateIndicador(editando.id, {
          cadastroId: form.cadastroId,
          nome: form.nome.trim(),
          tipo: form.tipo,
          documento: form.documento.trim(),
          telefone: form.telefone.trim(),
          email: form.email.trim(),
          pixTipo: form.pixTipo,
          pixChave: form.pixChave.trim(),
          pixTitularNome: form.pixTitularNome.trim(),
          pixTitularDocumento: form.pixTitularDocumento.trim(),
        });
      } else {
        preview.addIndicador({
          cadastroId: form.cadastroId,
          nome: form.nome.trim(),
          tipo: form.tipo,
          documento: form.documento.trim(),
          telefone: form.telefone.trim(),
          email: form.email.trim(),
          pixTipo: form.pixTipo,
          pixChave: form.pixChave.trim(),
          pixTitularNome: form.pixTitularNome.trim(),
          pixTitularDocumento: form.pixTitularDocumento.trim(),
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

  function registrarIndicacao() {
    if (!viewing || !indicacaoForm.indicadoId) return;
    if (indicacaoForm.indicadoId === viewing.cadastroId) return;
    if (jaIndicado(viewing.id, indicacaoForm.indicadoId)) return;

    const comissaoFinal =
      indicacaoForm.situacao === "Efetivada" ? indicacaoForm.comissao : 0;

    preview.addIndicacao({
      indicadorId: viewing.id,
      indicadoId: indicacaoForm.indicadoId,
      data: new Date().toLocaleDateString("pt-BR"),
      situacao: indicacaoForm.situacao,
      comissao: comissaoFinal,
      comissaoSituacao:
        indicacaoForm.situacao === "Efetivada" ? "A receber" : "Paga",
    });

    setIndicacaoForm({ indicadoId: "", situacao: "Pendente", comissao: COMISSAO_PADRAO });
    setShowIndicacaoForm(false);
  }

  const duplicado = indicadorDuplicado(form.cadastroId, editando?.id);

  return (
    <section className="ind-page">
      <div className="ind-panel">
        <div className="ind-toolbar">
          <label className="ind-search">
            <input
              type="search"
              placeholder="Buscar por nome ou CPF/CNPJ"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                resetPagina();
              }}
            />
          </label>

          <button className="ind-new" onClick={abrirNovo}>
            <Plus size={15} strokeWidth={1.7} /> Novo indicador
          </button>
        </div>

        <div className="ind-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">CPF/CNPJ</th>
                <th scope="col">Total de indicações</th>
                <th scope="col">Efetivado</th>
                <th scope="col">Valor a receber</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {exibidos.length > 0 ? (
                exibidos.map((item) => {
                  const t = getTotais(item.id);
                  return (
                    <tr key={item.id}>
                      <td>{item.nome}</td>
                      <td>{maskDocumentoTable(item.documento, item.tipo)}</td>
                      <td>{t.total}</td>
                      <td>{t.efetivadas}</td>
                      <td>{formatBrl(t.receber)}</td>
                      <td>
                        <div className="ind-row-actions">
                          <button
                            onClick={() => abrirVisualizacao(item)}
                            aria-label={`Ver ${item.nome}`}
                          >
                            <Eye size={15} strokeWidth={1.7} />
                          </button>
                          <button
                            onClick={() => abrirEdicao(item)}
                            aria-label={`Editar ${item.nome}`}
                          >
                            <Pencil size={15} strokeWidth={1.7} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="ind-empty">
                      <span>
                        Nenhum indicador adicionado nesta prévia. Clique em{" "}
                        <strong>Novo indicador</strong> para começar.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="ind-pagination">
          <span>
            {total > 0
              ? `${inicio + 1}–${Math.min(inicio + pageSize, total)} de ${total}`
              : "0 registros"}
          </span>
          <div className="ind-pagination-controls">
            <label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  resetPagina();
                }}
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s} por página
                  </option>
                ))}
              </select>
            </label>
            <button
              disabled={paginaAtual <= 1}
              onClick={() => setPagina(paginaAtual - 1)}
            >
              Anterior
            </button>
            <span>
              Página {paginaAtual} de {paginas}
            </span>
            <button
              disabled={paginaAtual >= paginas}
              onClick={() => setPagina(paginaAtual + 1)}
            >
              Próxima
            </button>
          </div>
        </footer>
      </div>

      {drawerOpen && !viewing && (
        <div
          className="ind-drawer-overlay"
          onClick={() => {
            setDrawerOpen(false);
            setSaveConfirm(false);
          }}
        >
          <aside
            className="ind-drawer"
            role="dialog"
            aria-label={editando ? "Editar indicador" : "Novo indicador"}
            tabIndex={-1}
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ind-drawer-header">
              <h3>{editando ? "Editar indicador" : "Novo indicador"}</h3>
              <button
                className="ind-drawer-close"
                onClick={() => {
                  setDrawerOpen(false);
                  setSaveConfirm(false);
                }}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <form className="ind-drawer-form" onSubmit={salvar}>
              <fieldset className="ind-fieldset">
                <legend>Dados do indicador</legend>

                <label className="ind-field">
                  <span>Cadastro vinculado</span>
                  <select
                    value={form.cadastroId}
                    onChange={(e) => onSelectCadastro(e.target.value)}
                    required
                  >
                    <option value="">Selecione um cadastro</option>
                    {preview.cadastros
                      .filter(
                        (c) =>
                          !indicadorDuplicado(c.id, editando?.id) ||
                          c.id === editando?.cadastroId
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome} ({c.tipo})
                        </option>
                      ))}
                  </select>
                  {duplicado && (
                    <em className="ind-field-error">
                      Este cadastro já está vinculado a um indicador.
                    </em>
                  )}
                </label>

                <label className="ind-field">
                  <span>Nome</span>
                  <input
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nome: e.target.value }))
                    }
                  />
                </label>

                <label className="ind-field">
                  <span>Tipo</span>
                  <select
                    value={form.tipo}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tipo: e.target.value as "PF" | "PJ",
                      }))
                    }
                  >
                    <option value="PF">Pessoa física</option>
                    <option value="PJ">Pessoa jurídica</option>
                  </select>
                </label>

                <label className="ind-field">
                  <span>CPF/CNPJ</span>
                  <input
                    type="text"
                    required
                    value={form.documento}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        documento: maskCpfCnpj(e.target.value, f.tipo),
                      }))
                    }
                  />
                </label>

                <div className="ind-field-row">
                  <label className="ind-field">
                    <span>Telefone</span>
                    <input
                      type="tel"
                      value={form.telefone}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          telefone: maskPhone(e.target.value),
                        }))
                      }
                    />
                  </label>

                  <label className="ind-field">
                    <span>E-mail</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset className="ind-fieldset">
                <legend>Dados para recebimento</legend>

                <label className="ind-field">
                  <span>Tipo de chave Pix</span>
                  <select
                    value={form.pixTipo}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        pixTipo: e.target.value as IndicadorRow["pixTipo"],
                        pixChave: "",
                      }))
                    }
                  >
                    {PIX_TIPOS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="ind-field">
                  <span>Chave Pix</span>
                  <input
                    type="text"
                    value={form.pixChave}
                    placeholder={
                      form.pixTipo === "Aleatória" ? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" : ""
                    }
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        pixChave: maskPixChave(e.target.value, f.pixTipo),
                      }))
                    }
                  />
                </label>

                <label className="ind-field">
                  <span>Nome do titular</span>
                  <input
                    type="text"
                    value={form.pixTitularNome}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        pixTitularNome: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="ind-field">
                  <span>CPF/CNPJ do titular</span>
                  <input
                    type="text"
                    value={form.pixTitularDocumento}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        pixTitularDocumento: maskCpfCnpj(
                          e.target.value,
                          form.tipo
                        ),
                      }))
                    }
                  />
                </label>
              </fieldset>

              <div className="ind-drawer-actions">
                <button
                  type="button"
                  className="ind-btn ind-btn--ghost"
                  onClick={() => {
                    setDrawerOpen(false);
                    setSaveConfirm(false);
                  }}
                >
                  {saveConfirm ? "Voltar" : "Cancelar"}
                </button>
                <button
                  type="submit"
                  className="ind-btn ind-btn--primary"
                  disabled={duplicado}
                >
                  {saveConfirm ? "Confirmar" : "Salvar"}
                </button>
              </div>
              {saveConfirm && (
                <p className="ind-save-confirm">
                  Deseja salvar este indicador?
                </p>
              )}
            </form>
          </aside>
        </div>
      )}

      {drawerOpen && viewing && (
        <div
          className="ind-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            className="ind-drawer"
            role="dialog"
            aria-label={`Visualizar ${viewing.nome}`}
            tabIndex={-1}
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ind-drawer-header">
              <h3>{viewing.nome}</h3>
              <button
                className="ind-drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ind-drawer-view">
              <dl className="ind-view-section">
                <dt>Cadastro vinculado</dt>
                <dd>{getNomeCadastro(viewing.cadastroId)}</dd>

                <dt>Tipo</dt>
                <dd>
                  {viewing.tipo === "PF" ? "Pessoa física" : "Pessoa jurídica"}
                </dd>

                <dt>CPF/CNPJ</dt>
                <dd>{viewing.documento}</dd>

                <dt>Telefone</dt>
                <dd>{viewing.telefone || "—"}</dd>

                <dt>E-mail</dt>
                <dd>{viewing.email || "—"}</dd>
              </dl>

              <dl className="ind-view-section">
                <dt>Tipo de chave Pix</dt>
                <dd>{viewing.pixTipo}</dd>

                <dt>Chave Pix</dt>
                <dd>
                  {viewing.pixChave ? (
                    <span className="ind-pix-reveal">
                      {pixRevelado
                        ? viewing.pixChave
                        : maskPixChaveView(viewing.pixChave)}
                      <button
                        type="button"
                        className="ind-pix-toggle"
                        onClick={() => setPixRevelado((v) => !v)}
                        aria-label={
                          pixRevelado ? "Ocultar chave" : "Revelar chave"
                        }
                      >
                        {pixRevelado ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </span>
                  ) : (
                    <span className="ind-pix-empty">
                      <ShieldOff size={12} strokeWidth={1.7} /> Pix não
                      informado
                    </span>
                  )}
                </dd>

                <dt>Titular</dt>
                <dd>{viewing.pixTitularNome || "—"}</dd>

                <dt>Documento do titular</dt>
                <dd>{viewing.pixTitularDocumento || "—"}</dd>
              </dl>

              <div className="ind-view-totals">
                <div className="ind-total-card">
                  <span>Total de indicações</span>
                  <strong>{getTotais(viewing.id).total}</strong>
                </div>
                <div className="ind-total-card">
                  <span>Efetivado</span>
                  <strong>{getTotais(viewing.id).efetivadas}</strong>
                </div>
                <div className="ind-total-card">
                  <span>Valor a receber</span>
                  <strong>{formatBrl(getTotais(viewing.id).receber)}</strong>
                </div>
              </div>

              <div className="ind-history-header">
                <h4>Histórico de indicações</h4>
                <button
                  className="ind-btn ind-btn--small ind-btn--primary"
                  onClick={() => setShowIndicacaoForm((v) => !v)}
                >
                  <UserPlus size={14} strokeWidth={1.7} /> Registrar
                </button>
              </div>

              {showIndicacaoForm && (
                <div className="ind-indicacao-form">
                  <label className="ind-field">
                    <span>Indicado (cadastro)</span>
                    <select
                      value={indicacaoForm.indicadoId}
                      onChange={(e) =>
                        setIndicacaoForm((f) => ({
                          ...f,
                          indicadoId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Selecione</option>
                      {preview.cadastros
                        .filter(
                          (c) =>
                            c.id !== viewing.cadastroId &&
                            !jaIndicado(viewing.id, c.id)
                        )
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                    </select>
                  </label>

                  <label className="ind-field">
                    <span>Situação</span>
                    <select
                      value={indicacaoForm.situacao}
                      onChange={(e) =>
                        setIndicacaoForm((f) => ({
                          ...f,
                          situacao: e.target.value as IndicacaoRow["situacao"],
                        }))
                      }
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Efetivada">Efetivada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </label>

                  {indicacaoForm.situacao === "Efetivada" && (
                    <label className="ind-field">
                      <span>Comissão (R$)</span>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={indicacaoForm.comissao}
                        onChange={(e) =>
                          setIndicacaoForm((f) => ({
                            ...f,
                            comissao: Number(e.target.value),
                          }))
                        }
                      />
                    </label>
                  )}

                  <div className="ind-drawer-actions">
                    <button
                      type="button"
                      className="ind-btn ind-btn--ghost"
                      onClick={() => setShowIndicacaoForm(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="ind-btn ind-btn--primary"
                      disabled={
                        !indicacaoForm.indicadoId ||
                        indicacaoForm.indicadoId === viewing.cadastroId
                      }
                      onClick={registrarIndicacao}
                    >
                      Registrar
                    </button>
                  </div>
                </div>
              )}

              {preview.indicacoes.filter((i) => i.indicadorId === viewing.id)
                .length > 0 ? (
                <table className="ind-history-table">
                  <thead>
                    <tr>
                      <th scope="col">Indicado</th>
                      <th scope="col">Data</th>
                      <th scope="col">Situação</th>
                      <th scope="col">Comissão</th>
                      <th scope="col">Status comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.indicacoes
                      .filter((i) => i.indicadorId === viewing.id)
                      .sort((a, b) => (a.data < b.data ? 1 : -1))
                      .map((ind) => (
                        <tr key={ind.id}>
                          <td>{getNomeCadastro(ind.indicadoId)}</td>
                          <td>{ind.data}</td>
                          <td>
                            <span
                              className={`ind-badge ind-badge--${ind.situacao.toLowerCase()}`}
                            >
                              {ind.situacao}
                            </span>
                          </td>
                          <td>{formatBrl(ind.comissao)}</td>
                          <td>
                            <span
                              className={`ind-badge ${
                                ind.comissaoSituacao === "A receber"
                                  ? "ind-badge--areceber"
                                  : "ind-badge--paga"
                              }`}
                            >
                              {ind.comissaoSituacao}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="ind-history-empty">
                  Nenhuma indicação registrada.
                </p>
              )}
            </div>

            <div className="ind-drawer-actions">
              <button
                className="ind-btn ind-btn--primary"
                onClick={() => setDrawerOpen(false)}
              >
                Fechar
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
