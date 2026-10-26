import { useState, useRef, useEffect, useMemo, type FormEvent } from "react";
import { Plus, Eye, Pencil, Trash2, Ban, X, Search, UserPlus, RotateCcw } from "lucide-react";
import { usePreview } from "@/context/PreviewContext";
import type { AssinaturaRow, CadastroRow, Periodicidade, PlanoRow } from "@/context/PreviewContext";
import "@/styles/planos-page.css";

type AssinaturaForm = {
  cadastroId: string;
  planoId: string;
  valor: number;
  periodicidade: Periodicidade;
  situacao: "Pendente" | "Regular" | "Cancelado";
};

const emptyForm: AssinaturaForm = {
  cadastroId: "",
  planoId: "",
  valor: 0,
  periodicidade: "mensal",
  situacao: "Pendente",
};

type NovoAssinanteForm = {
  nome: string;
  tipo: "PF" | "PJ";
  documento: string;
  telefone: string;
  email: string;
};

const emptyNovoAssinante: NovoAssinanteForm = {
  nome: "",
  tipo: "PF",
  documento: "",
  telefone: "",
  email: "",
};

const SITUACOES: AssinaturaForm["situacao"][] = ["Pendente", "Regular", "Cancelado"];
const PERIODICIDADES: Periodicidade[] = ["mensal", "semestral", "anual"];

const PERIODICIDADE_LABELS: Record<Periodicidade, string> = {
  mensal: "Mensal",
  semestral: "Semestral",
  anual: "Anual",
};

const PERIODICIDADE_VALOR_LABELS: Record<Periodicidade, string> = {
  mensal: "Valor mensal",
  semestral: "Valor semestral",
  anual: "Valor anual",
};

function formatBrl(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function maskDoc(doc: string): string {
  const d = doc.replace(/\D/g, "");
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  }
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, "$1.$2.$3/$4-$5");
}

function formatValorInput(valor: number): string {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getFirstEnabledPeriodo(plano: PlanoRow): Periodicidade | null {
  const ordem: Periodicidade[] = ["mensal", "semestral", "anual"];
  for (const p of ordem) {
    if (plano.precos[p].enabled) return p;
  }
  return null;
}

function parseValorInput(raw: string): number {
  const cleaned = raw.replace(/\D/g, "");
  if (!cleaned) return 0;
  return parseInt(cleaned, 10) / 100;
}

type PageInfo = { start: number; end: number; total: number };

function paginate<T>(items: T[], page: number, perPage: number): { data: T[]; info: PageInfo } {
  const total = items.length;
  const maxPage = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, maxPage);
  const startIdx = (safePage - 1) * perPage;
  const data = items.slice(startIdx, startIdx + perPage);
  return {
    data,
    info: {
      start: total === 0 ? 0 : startIdx + 1,
      end: Math.min(startIdx + perPage, total),
      total,
    },
  };
}

export default function AssinaturasPage() {
  const preview = usePreview();

  const [busca, setBusca] = useState("");
  const [filtroPlano, setFiltroPlano] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<AssinaturaForm>(emptyForm);
  const [valorFormatado, setValorFormatado] = useState("0,00");

  const [viewing, setViewing] = useState<AssinaturaRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AssinaturaRow | null>(null);
  const [blockConfirm, setBlockConfirm] = useState<AssinaturaRow | null>(null);

  // Assinante search state
  const [assinanteBusca, setAssinanteBusca] = useState("");
  const [assinanteSelecionado, setAssinanteSelecionado] = useState<CadastroRow | null>(null);
  const [modoNovoAssinante, setModoNovoAssinante] = useState(false);
  const [novoAssinante, setNovoAssinante] = useState<NovoAssinanteForm>(emptyNovoAssinante);

  const dialogRef = useRef<HTMLDivElement>(null);
  const buscaRef = useRef<HTMLInputElement>(null);

  const assinanteResultados = useMemo(() => {
    const termo = assinanteBusca.trim().toLowerCase();
    if (termo.length < 2) return [];
    return preview.cadastros.filter((c) =>
      c.nome.toLowerCase().includes(termo)
      || c.documento.toLowerCase().includes(termo)
      || c.email.toLowerCase().includes(termo)
    );
  }, [assinanteBusca, preview.cadastros]);

  useEffect(() => {
    if ((modalOpen || viewing || deleteConfirm || blockConfirm) && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [modalOpen, viewing, deleteConfirm, blockConfirm]);

  useEffect(() => {
    if (modalOpen && buscaRef.current) {
      buscaRef.current.focus();
    }
  }, [modalOpen]);

  function resetPage() {
    setPage(1);
  }

  const filtradas = preview.assinaturas.filter((a) => {
    const termo = busca.trim().toLowerCase();
    const matchBusca = !termo
      || a.nome.toLowerCase().includes(termo)
      || a.cadastroNome.toLowerCase().includes(termo)
      || a.cadastroDocumento.toLowerCase().includes(termo)
      || a.cadastroTelefone.toLowerCase().includes(termo)
      || a.cadastroEmail.toLowerCase().includes(termo);
    const matchPlano = !filtroPlano || a.planoId === filtroPlano;
    const matchSituacao = !filtroSituacao || a.situacao === filtroSituacao;
    return matchBusca && matchPlano && matchSituacao;
  });

  const { data: assinaturasPage, info } = paginate(filtradas, page, perPage);

  function resetAssinanteState() {
    setAssinanteBusca("");
    setAssinanteSelecionado(null);
    setModoNovoAssinante(false);
    setNovoAssinante(emptyNovoAssinante);
  }

  function abrirNova() {
    setEditId(null);
    setForm(emptyForm);
    setValorFormatado("0,00");
    resetAssinanteState();
    setModalOpen(true);
  }

  function abrirEdicao(id: string) {
    const sub = preview.assinaturas.find((a) => a.id === id);
    if (!sub) return;
    setEditId(id);
    const periodicidadeValida = sub.periodicidade;
    setForm({
      cadastroId: sub.cadastroId,
      planoId: sub.planoId,
      valor: sub.valor,
      periodicidade: periodicidadeValida,
      situacao: sub.situacao,
    });
    setValorFormatado(formatValorInput(sub.valor));
    const cadastro = preview.cadastros.find((c) => c.id === sub.cadastroId);
    setAssinanteSelecionado(cadastro ?? null);
    setAssinanteBusca(cadastro?.nome ?? "");
    setModoNovoAssinante(false);
    setNovoAssinante(emptyNovoAssinante);
    setModalOpen(true);
  }

  function handlePlanoChange(planoId: string) {
    const plano = preview.planos.find((p) => p.id === planoId);
    if (plano) {
      const periodoDefault = getFirstEnabledPeriodo(plano);
      const valorPeriodo = periodoDefault ? plano.precos[periodoDefault].valor : 0;
      setForm((f) => ({
        ...f,
        planoId,
        valor: valorPeriodo,
        periodicidade: periodoDefault ?? "mensal",
      }));
      setValorFormatado(formatValorInput(valorPeriodo));
    } else {
      setForm((f) => ({ ...f, planoId }));
    }
  }

  function handlePeriodicidadeChange(nova: Periodicidade) {
    const plano = preview.planos.find((p) => p.id === form.planoId);
    if (plano && plano.precos[nova].enabled) {
      setForm((f) => ({ ...f, periodicidade: nova, valor: plano.precos[nova].valor }));
      setValorFormatado(formatValorInput(plano.precos[nova].valor));
    } else {
      setForm((f) => ({ ...f, periodicidade: nova }));
    }
  }

  function handleValorChange(raw: string) {
    setValorFormatado(raw);
    setForm((f) => ({ ...f, valor: parseValorInput(raw) }));
  }

  function handleValorBlur() {
    setValorFormatado(formatValorInput(form.valor));
  }

  function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const plano = preview.planos.find((p) => p.id === form.planoId);
    if (!plano) return;

    let cadastro: CadastroRow;
    if (modoNovoAssinante) {
      if (!novoAssinante.nome.trim()) return;
      cadastro = preview.addCadastro({
        nome: novoAssinante.nome.trim(),
        tipo: novoAssinante.tipo,
        documento: novoAssinante.documento.replace(/\D/g, ""),
        email: novoAssinante.email.trim(),
        telefone: novoAssinante.telefone.trim(),
        situacao: "Ativo",
        atividade: "Comércio",
        planoId: form.planoId,
      });
    } else {
      const found = preview.cadastros.find((c) => c.id === form.cadastroId);
      if (!found) return;
      cadastro = found;
    }

    const data = {
      nome: cadastro.nome,
      cadastroId: cadastro.id,
      cadastroNome: cadastro.nome,
      cadastroTipo: cadastro.tipo,
      cadastroDocumento: cadastro.documento,
      cadastroTelefone: cadastro.telefone,
      cadastroEmail: cadastro.email,
      planoId: form.planoId,
      planoNome: plano.nome,
      valor: form.valor,
      periodicidade: form.periodicidade,
      situacao: form.situacao,
      bloqueada: editId ? (preview.assinaturas.find((a) => a.id === editId)?.bloqueada ?? false) : false,
      planoSnapshot: {
        precos: plano.precos,
        permissoes: plano.permissoes,
      },
    };

    if (editId) {
      preview.updateAssinatura(editId, data);
    } else {
      preview.addAssinatura(data);
    }
    setModalOpen(false);
    setEditId(null);
  }

  function confirmarExclusao() {
    if (deleteConfirm) {
      preview.removeAssinatura(deleteConfirm.id);
      setDeleteConfirm(null);
      ajustarPagina();
    }
  }

  function toggleBloqueio() {
    if (!blockConfirm) return;
    preview.updateAssinatura(blockConfirm.id, { bloqueada: !blockConfirm.bloqueada });
    setBlockConfirm(null);
  }

  function ajustarPagina() {
    const maxPage = Math.max(1, Math.ceil(filtradas.length / perPage));
    if (page > maxPage) setPage(maxPage);
  }

  function handlePerPageChange(val: number) {
    setPerPage(val);
    setPage(1);
  }

  const cadastroSelecionado = assinanteSelecionado ?? (modoNovoAssinante ? null : preview.cadastros.find((c) => c.id === form.cadastroId));
  const planoSelecionado = preview.planos.find((p) => p.id === form.planoId);

  return (
    <section className="pln-page">
      <div className="pln-toolbar">
        <label className="pln-search">
          <input
            type="search"
            placeholder="Buscar nome, CPF/CNPJ, telefone ou e-mail..."
            value={busca}
            onChange={(e) => { setBusca(e.target.value); resetPage(); }}
          />
        </label>
        <select
          className="pln-select-filter"
          value={filtroPlano}
          onChange={(e) => { setFiltroPlano(e.target.value); resetPage(); }}
        >
          <option value="">Todos os planos</option>
          {preview.planos.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        <select
          className="pln-select-filter"
          value={filtroSituacao}
          onChange={(e) => { setFiltroSituacao(e.target.value); resetPage(); }}
        >
          <option value="">Todos os status</option>
          {SITUACOES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button className="pln-btn pln-btn--primary" onClick={abrirNova}>
          <Plus size={14} /> Nova assinatura
        </button>
      </div>

      {preview.cadastros.length === 0 || preview.planos.length === 0 ? (
        <div className="pln-empty">
          <strong>Cadastros e planos necessários</strong>
          <span>
            {preview.cadastros.length === 0 && preview.planos.length === 0
              ? "Crie cadastros na página Cadastros e planos na página Planos para vincular aqui."
              : preview.cadastros.length === 0
              ? "Crie cadastros na página Cadastros para vincular aqui."
              : "Crie planos na página Planos para vincular aqui."}
          </span>
        </div>
      ) : assinaturasPage.length === 0 ? (
        <div className="pln-empty">
          <strong>Nenhuma assinatura encontrada</strong>
          <span>Clique em "Nova assinatura" para criar.</span>
        </div>
      ) : (
        <div className="pln-table-wrap">
          <table className="pln-table">
             <thead>
               <tr>
                 <th>Assinante</th>
                 <th>Plano</th>
                 <th>Valor</th>
                 <th>Pagamento</th>
                 <th>Status</th>
                 <th>Ações</th>
               </tr>
             </thead>
            <tbody>
               {assinaturasPage.map((a) => (
                 <tr key={a.id} className={a.bloqueada ? "is-blocked" : ""}>
                   <td>
                     <strong>{a.cadastroNome}</strong>
                     {a.bloqueada && <span className="pln-badge pln-badge--blocked">Bloqueada</span>}
                   </td>
                     <td>{a.planoNome}</td>
                     <td>{formatBrl(a.valor)}</td>
                     <td>{PERIODICIDADE_LABELS[a.periodicidade]}</td>
                     <td>
                       <span className={`pln-badge pln-badge--${a.situacao === "Regular" ? "success" : a.situacao === "Pendente" ? "warning" : "muted"}`}>
                         {a.situacao}
                       </span>
                     </td>
                    <td>
                      <div className="pln-actions">
                         <button className="pln-icon-btn" onClick={() => setViewing(a)} aria-label={`Ver ${a.cadastroNome}`} title="Ver">
                           <Eye size={14} />
                         </button>
                         <button className="pln-icon-btn" onClick={() => abrirEdicao(a.id)} aria-label={`Editar ${a.cadastroNome}`} title="Editar">
                           <Pencil size={14} />
                         </button>
                         <button className="pln-icon-btn pln-icon-btn--danger" onClick={() => setDeleteConfirm(a)} aria-label={`Excluir ${a.cadastroNome}`} title="Excluir">
                           <Trash2 size={14} />
                         </button>
                         <button
                           className={`pln-icon-btn ${a.bloqueada ? "pln-icon-btn--unblock" : "pln-icon-btn--block"}`}
                           onClick={() => setBlockConfirm(a)}
                           aria-label={`${a.bloqueada ? "Desbloquear" : "Bloquear"} ${a.cadastroNome}`}
                           title={a.bloqueada ? "Desbloquear" : "Bloquear"}
                         >
                           <Ban size={14} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {info.total > 0 && (
        <div className="pln-pagination">
          <span className="pln-page-info">
            {info.start}–{info.end} de {info.total}
          </span>
          <div className="pln-page-controls">
            <select
              className="pln-per-page"
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
            <button
              className="pln-btn pln-btn--ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <span className="pln-page-current">{page}</span>
            <button
              className="pln-btn pln-btn--ghost"
              disabled={page >= Math.ceil(info.total / perPage)}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Assinatura Modal */}
      {modalOpen && (
        <div className="pln-modal-overlay" onClick={() => { setModalOpen(false); setEditId(null); resetAssinanteState(); }}>
          <div
            className="pln-modal"
            role="dialog"
            aria-label={editId ? "Editar assinatura" : "Nova assinatura"}
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pln-modal-header">
              <h3>{editId ? "Editar assinatura" : "Nova assinatura"}</h3>
              <button className="pln-modal-close" onClick={() => { setModalOpen(false); setEditId(null); resetAssinanteState(); }} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <form className="pln-modal-form" onSubmit={salvar}>
              {/* 1. Buscar assinante */}
              <div className="pln-assinante-busca">
                <label className="pln-field">
                  <span>Buscar assinante</span>
                  <div className="pln-search-input-wrap">
                    <Search size={14} className="pln-search-icon" />
                    <input
                      ref={buscaRef}
                      type="search"
                      placeholder="Busque por nome, CPF/CNPJ ou e-mail"
                      value={assinanteBusca}
                      onChange={(e) => {
                        setAssinanteBusca(e.target.value);
                        setAssinanteSelecionado(null);
                        setForm((f) => ({ ...f, cadastroId: "" }));
                        setModoNovoAssinante(false);
                      }}
                    />
                  </div>
                </label>

                {assinanteBusca.trim().length >= 2 && assinanteResultados.length > 0 && !assinanteSelecionado && (
                  <ul className="pln-busca-resultados">
                    {assinanteResultados.map((c) => (
                      <li
                        key={c.id}
                        onClick={() => {
                          setAssinanteSelecionado(c);
                          setForm((f) => ({ ...f, cadastroId: c.id }));
                          setAssinanteBusca(c.nome);
                          setModoNovoAssinante(false);
                        }}
                      >
                        <span className="pln-busca-result-nome">{c.nome}</span>
                        <span className="pln-busca-result-doc">{maskDoc(c.documento)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {assinanteBusca.trim().length >= 2 && assinanteResultados.length === 0 && !assinanteSelecionado && preview.cadastros.length > 0 && (
                  <div className="pln-busca-vazia">
                    <span>Nenhum assinante encontrado</span>
                  </div>
                )}

                {assinanteSelecionado && (
                  <div className="pln-cadastro-preview">
                    <div className="pln-cadastro-preview-top">
                      <span className="pln-cadastro-preview-nome">{assinanteSelecionado.nome}</span>
                      <button
                        type="button"
                        className="pln-btn-trocar"
                        onClick={() => {
                          setAssinanteSelecionado(null);
                          setForm((f) => ({ ...f, cadastroId: "" }));
                          setAssinanteBusca("");
                          buscaRef.current?.focus();
                        }}
                      >
                        <RotateCcw size={12} /> Trocar
                      </button>
                    </div>
                    <span><strong>Tipo:</strong> {assinanteSelecionado.tipo === "PF" ? "Pessoa física" : "Pessoa jurídica"}</span>
                    <span><strong>Documento:</strong> {maskDoc(assinanteSelecionado.documento)}</span>
                    <span><strong>Telefone:</strong> {assinanteSelecionado.telefone || "—"}</span>
                    <span><strong>E-mail:</strong> {assinanteSelecionado.email || "—"}</span>
                  </div>
                )}

                {!modoNovoAssinante && !assinanteSelecionado && (
                  <button
                    type="button"
                    className="pln-btn-novo-assinante"
                    onClick={() => {
                      setModoNovoAssinante(true);
                      setAssinanteBusca("");
                    }}
                  >
                    <UserPlus size={14} /> Cadastrar novo assinante
                  </button>
                )}

                {modoNovoAssinante && (
                  <div className="pln-novo-assinante-form">
                    <div className="pln-novo-assinante-header">
                      <span>Novo assinante</span>
                      <button
                        type="button"
                        className="pln-btn-trocar"
                        onClick={() => {
                          setModoNovoAssinante(false);
                          setNovoAssinante(emptyNovoAssinante);
                        }}
                      >
                        <RotateCcw size={12} /> Voltar
                      </button>
                    </div>
                    <label className="pln-field">
                      <span>Nome do assinante / Razão social</span>
                      <input
                        type="text"
                        placeholder="Nome completo ou razão social"
                        value={novoAssinante.nome}
                        onChange={(e) => setNovoAssinante((f) => ({ ...f, nome: e.target.value }))}
                      />
                    </label>
                    <div className="pln-form-row">
                      <label className="pln-field">
                        <span>Tipo</span>
                        <select
                          value={novoAssinante.tipo}
                          onChange={(e) => setNovoAssinante((f) => ({ ...f, tipo: e.target.value as "PF" | "PJ" }))}
                        >
                          <option value="PF">Pessoa física</option>
                          <option value="PJ">Pessoa jurídica</option>
                        </select>
                      </label>
                      <label className="pln-field">
                        <span>CPF/CNPJ</span>
                        <input
                          type="text"
                          placeholder="Somente números"
                          value={novoAssinante.documento}
                          onChange={(e) => setNovoAssinante((f) => ({ ...f, documento: e.target.value.replace(/\D/g, "") }))}
                        />
                      </label>
                    </div>
                    <div className="pln-form-row">
                      <label className="pln-field">
                        <span>Telefone</span>
                        <input
                          type="tel"
                          placeholder="(00) 00000-0000"
                          value={novoAssinante.telefone}
                          onChange={(e) => setNovoAssinante((f) => ({ ...f, telefone: e.target.value }))}
                        />
                      </label>
                      <label className="pln-field">
                        <span>E-mail</span>
                        <input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={novoAssinante.email}
                          onChange={(e) => setNovoAssinante((f) => ({ ...f, email: e.target.value }))}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Plano */}
              <label className="pln-field">
                <span>Plano</span>
                <select
                  value={form.planoId}
                  onChange={(e) => handlePlanoChange(e.target.value)}
                  required
                >
                  <option value="">Selecione um plano</option>
                  {preview.planos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}{p.gratuito ? " — Gratuito" : ` — desde ${formatBrl(p.precos.mensal.valor)}/mês`}
                    </option>
                  ))}
                </select>
              </label>

              {/* 4. Valor por período + 5. Pagamento lado a lado */}
              <div className="pln-field-row">
                <label className="pln-field">
                  <span>{PERIODICIDADE_VALOR_LABELS[form.periodicidade]}</span>
                  <div className="pln-input-currency">
                    <span className="pln-currency-symbol">R$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={valorFormatado}
                      onChange={(e) => handleValorChange(e.target.value)}
                      onBlur={handleValorBlur}
                    />
                  </div>
                </label>

                <label className="pln-field">
                  <span>Pagamento</span>
                  <select
                    value={form.periodicidade}
                    onChange={(e) => handlePeriodicidadeChange(e.target.value as Periodicidade)}
                  >
                    {PERIODICIDADES.map((p) => {
                      const plano = preview.planos.find((pl) => pl.id === form.planoId);
                      const enabled = plano ? plano.precos[p].enabled : true;
                      return (
                        <option key={p} value={p} disabled={!enabled}>
                          {PERIODICIDADE_LABELS[p]}{enabled ? "" : " (indisponível)"}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>

              {/* 6. Status */}
              <label className="pln-field">
                <span>Status</span>
                <select
                  value={form.situacao}
                  onChange={(e) => setForm((f) => ({ ...f, situacao: e.target.value as AssinaturaForm["situacao"] }))}
                >
                  {SITUACOES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <div className="pln-modal-actions">
                <button type="button" className="pln-btn pln-btn--ghost" onClick={() => { setModalOpen(false); setEditId(null); resetAssinanteState(); }}>
                  Cancelar
                </button>
                <button type="submit" className="pln-btn pln-btn--primary">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="pln-modal-overlay" onClick={() => setViewing(null)}>
          <div
            className="pln-modal"
            role="dialog"
            aria-label={`Visualizar ${viewing.cadastroNome}`}
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pln-modal-header">
              <h3>{viewing.cadastroNome}</h3>
              <button className="pln-modal-close" onClick={() => setViewing(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
             <div className="pln-view-body">
               <dl>
                 <dt>Assinante</dt>
                 <dd>{viewing.cadastroNome}</dd>
                <dt>Tipo</dt>
                <dd>{viewing.cadastroTipo === "PF" ? "Pessoa física" : "Pessoa jurídica"}</dd>
                <dt>Plano</dt>
                <dd>{viewing.planoNome}</dd>
                <dt>Valor ({PERIODICIDADE_LABELS[viewing.periodicidade]})</dt>
                <dd>{formatBrl(viewing.valor)}</dd>
                <dt>Status</dt>
                <dd>
                  <span className={`pln-badge pln-badge--${viewing.situacao === "Regular" ? "success" : viewing.situacao === "Pendente" ? "warning" : "muted"}`}>
                    {viewing.situacao}
                  </span>
                </dd>
                <dt>Bloqueio</dt>
                <dd>{viewing.bloqueada ? <span className="pln-badge pln-badge--blocked">Bloqueada</span> : <span className="pln-badge pln-badge--muted">Ativa</span>}</dd>
                <dt>CPF/CNPJ</dt>
                <dd>{maskDoc(viewing.cadastroDocumento)}</dd>
                <dt>Telefone</dt>
                <dd>{viewing.cadastroTelefone || "—"}</dd>
                <dt>E-mail</dt>
                <dd>{viewing.cadastroEmail || "—"}</dd>
              </dl>
            </div>
            <div className="pln-modal-actions">
              <button className="pln-btn pln-btn--primary" onClick={() => setViewing(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="pln-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="pln-modal pln-modal--confirm"
            role="alertdialog"
            aria-label="Excluir assinatura"
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pln-modal-header">
              <h3>Excluir assinatura?</h3>
              <button className="pln-modal-close" onClick={() => setDeleteConfirm(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
            <div className="pln-confirm-body">
              <p>Deseja excluir a assinatura de <strong>{deleteConfirm.cadastroNome}</strong>?</p>
            </div>
            <div className="pln-modal-actions">
              <button className="pln-btn pln-btn--ghost" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button className="pln-btn pln-btn--danger" onClick={confirmarExclusao}>
                Confirmar exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirm */}
      {blockConfirm && (
        <div className="pln-modal-overlay" onClick={() => setBlockConfirm(null)}>
          <div
            className="pln-modal pln-modal--confirm"
            role="alertdialog"
            aria-label={blockConfirm.bloqueada ? "Desbloquear assinatura" : "Bloquear assinatura"}
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pln-modal-header">
              <h3>{blockConfirm.bloqueada ? "Desbloquear assinatura" : "Bloquear assinatura"}</h3>
              <button className="pln-modal-close" onClick={() => setBlockConfirm(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
            <div className="pln-confirm-body">
              <p>Deseja {blockConfirm.bloqueada ? "desbloquear" : "bloquear"} a assinatura de <strong>{blockConfirm.cadastroNome}</strong>?</p>
            </div>
            <div className="pln-modal-actions">
              <button className="pln-btn pln-btn--ghost" onClick={() => setBlockConfirm(null)}>
                Cancelar
              </button>
              <button className="pln-btn pln-btn--danger" onClick={toggleBloqueio}>
                Confirmar {blockConfirm.bloqueada ? "desbloqueio" : "bloqueio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
