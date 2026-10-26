import { useState, useRef, useEffect, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Eye } from "lucide-react";
import { usePreview } from "@/context/PreviewContext";
import type { PlanoRow, PrecosPlanos, PlanoPermissoes, Periodicidade } from "@/context/PreviewContext";
import "@/styles/planos-page.css";

type PeriodosForm = {
  [K in Periodicidade]: {
    enabled: boolean;
    valorRaw: string;
    descontoRaw: string;
  };
};

type PlanoForm = {
  nome: string;
  gratuito: boolean;
  precos: PeriodosForm;
  permissoes: PlanoPermissoes;
};

function defaultForm(): PlanoForm {
  return {
    nome: "",
    gratuito: false,
    precos: {
      mensal: { enabled: true, valorRaw: "", descontoRaw: "" },
      semestral: { enabled: false, valorRaw: "", descontoRaw: "" },
      anual: { enabled: false, valorRaw: "", descontoRaw: "" },
    },
    permissoes: {
      perfil: false,
      ofertas: {
        enabled: false,
        quantidade: 1,
        periodoLimite: "dia",
        duracao: { quantidade: 24, unidade: "horas" },
        formatos: { texto: true, foto: true, video: true },
      },
      produtos: { enabled: false, quantidadeMaxima: 0 },
      destaques: { enabled: false, quantidade: 0, duracao: { quantidade: 24, unidade: "horas" } },
    },
  };
}

const PERIODOS: Periodicidade[] = ["mensal", "semestral", "anual"];

const PERIODICIDADE_LABELS: Record<Periodicidade, string> = {
  mensal: "Mensal",
  semestral: "Semestral",
  anual: "Anual",
};

function formatBrl(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseValorRaw(raw: string): number {
  const cleaned = raw.replace(/\D/g, "");
  if (!cleaned) return 0;
  return parseInt(cleaned, 10) / 100;
}

function formatValorRaw(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function clampInt(val: number, min = 0): number {
  return Math.max(min, Math.round(val));
}

function clampDesconto(val: number): number {
  return Math.min(100, Math.max(0, val));
}

export default function PlanosPage() {
  const preview = usePreview();

  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanoForm>(defaultForm());
  const [deleteConfirm, setDeleteConfirm] = useState<PlanoRow | null>(null);
  const [viewing, setViewing] = useState<PlanoRow | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((modalOpen || deleteConfirm || viewing) && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [modalOpen, deleteConfirm, viewing]);

  const planosFiltrados = preview.planos.filter((p) => {
    const termo = busca.trim().toLowerCase();
    return !termo || p.nome.toLowerCase().includes(termo);
  });

  function abrirNovo() {
    setEditId(null);
    setForm(defaultForm());
    setModalOpen(true);
  }

  function abrirEdicao(id: string) {
    const plano = preview.planos.find((p) => p.id === id);
    if (!plano) return;
    setEditId(id);
    setForm({
      nome: plano.nome,
      gratuito: plano.gratuito,
      precos: {
        mensal: {
          enabled: plano.precos.mensal.enabled,
          valorRaw: plano.gratuito ? "" : formatValorRaw(plano.precos.mensal.valor),
          descontoRaw: "",
        },
        semestral: {
          enabled: plano.precos.semestral.enabled,
          valorRaw: plano.gratuito ? "" : formatValorRaw(plano.precos.semestral.valor),
          descontoRaw: plano.precos.semestral.desconto.toString(),
        },
        anual: {
          enabled: plano.precos.anual.enabled,
          valorRaw: plano.gratuito ? "" : formatValorRaw(plano.precos.anual.valor),
          descontoRaw: plano.precos.anual.desconto.toString(),
        },
      },
      permissoes: {
        perfil: plano.permissoes.perfil,
        ofertas: { ...plano.permissoes.ofertas, duracao: { ...plano.permissoes.ofertas.duracao }, formatos: { ...plano.permissoes.ofertas.formatos } },
        produtos: { ...plano.permissoes.produtos },
        destaques: { ...plano.permissoes.destaques, duracao: { ...plano.permissoes.destaques.duracao } },
      },
    });
    setModalOpen(true);
  }

  function handleGratuitoToggle(val: boolean) {
    setForm((f) => {
      if (val) {
        return {
          ...f,
          gratuito: true,
          precos: {
            mensal: { enabled: true, valorRaw: "", descontoRaw: "" },
            semestral: { enabled: false, valorRaw: "", descontoRaw: "" },
            anual: { enabled: false, valorRaw: "", descontoRaw: "" },
          },
        };
      }
      return { ...f, gratuito: false };
    });
  }

  function handlePeriodoEnabled(periodo: Periodicidade, enabled: boolean) {
    setForm((f) => ({
      ...f,
      precos: {
        ...f.precos,
        [periodo]: { ...f.precos[periodo], enabled },
      },
    }));
  }

  function handleValorChange(periodo: Periodicidade, raw: string) {
    setForm((f) => {
      const newPrecos = { ...f.precos };
      newPrecos[periodo] = { ...newPrecos[periodo], valorRaw: raw };

      const valor = parseValorRaw(raw);

      if (periodo === "mensal") {
        const baseSem = valor * 6;
        const baseAnual = valor * 12;

        if (newPrecos.semestral.enabled && baseSem > 0) {
          const descSem = newPrecos.semestral.descontoRaw
            ? clampDesconto(parseFloat(newPrecos.semestral.descontoRaw) || 0)
            : 0;
          newPrecos.semestral = {
            ...newPrecos.semestral,
            valorRaw: formatValorRaw(Math.round(baseSem * (1 - descSem / 100) * 100) / 100),
          };
        }

        if (newPrecos.anual.enabled && baseAnual > 0) {
          const descAnual = newPrecos.anual.descontoRaw
            ? clampDesconto(parseFloat(newPrecos.anual.descontoRaw) || 0)
            : 0;
          newPrecos.anual = {
            ...newPrecos.anual,
            valorRaw: formatValorRaw(Math.round(baseAnual * (1 - descAnual / 100) * 100) / 100),
          };
        }
      } else {
        const mensal = parseValorRaw(newPrecos.mensal.valorRaw);
        const base = mensal * (periodo === "semestral" ? 6 : 12);
        if (base > 0) {
          const desc = Math.round((1 - valor / base) * 10000) / 100;
          newPrecos[periodo] = { ...newPrecos[periodo], descontoRaw: clampDesconto(desc).toString() };
        }
      }

      return { ...f, precos: newPrecos };
    });
  }

  function handleValorBlur(periodo: Periodicidade) {
    setForm((f) => {
      const raw = f.precos[periodo].valorRaw;
      const valor = parseValorRaw(raw);
      const newPrecos = { ...f.precos };
      newPrecos[periodo] = { ...newPrecos[periodo], valorRaw: formatValorRaw(valor) };
      return { ...f, precos: newPrecos };
    });
  }

  function handleDescontoChange(periodo: Periodicidade, raw: string) {
    if (periodo === "mensal") return;

    setForm((f) => {
      const desconto = clampDesconto(parseFloat(raw) || 0);
      const newPrecos = { ...f.precos };
      newPrecos[periodo] = { ...newPrecos[periodo], descontoRaw: raw };

      const mensal = parseValorRaw(newPrecos.mensal.valorRaw);
      const base = mensal * (periodo === "semestral" ? 6 : 12);
      const total = Math.round(base * (1 - desconto / 100) * 100) / 100;
      newPrecos[periodo] = { ...newPrecos[periodo], valorRaw: formatValorRaw(total) };

      return { ...f, precos: newPrecos };
    });
  }

  function handleDescontoBlur(periodo: Periodicidade) {
    if (periodo === "mensal") return;
    setForm((f) => {
      const raw = f.precos[periodo].descontoRaw;
      const desc = clampDesconto(parseFloat(raw) || 0);
      const newPrecos = { ...f.precos };
      newPrecos[periodo] = { ...newPrecos[periodo], descontoRaw: desc.toString() };
      return { ...f, precos: newPrecos };
    });
  }

  function handlePermissoesChange(path: string, value: unknown) {
    setForm((f) => {
      const p = { ...f.permissoes };
      const partes = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = p;
      for (let i = 0; i < partes.length - 1; i++) {
        obj[partes[i]] = { ...obj[partes[i]] };
        obj = obj[partes[i]];
      }
      obj[partes[partes.length - 1]] = value;

      if (path === "produtos.enabled" && value === false) {
        obj.quantidadeMaxima = 0;
      }
      if (path === "ofertas.enabled" && value === false) {
        obj.quantidade = 0;
      }
      if (path === "destaques.enabled" && value === false) {
        obj.quantidade = 0;
      }

      return { ...f, permissoes: p };
    });
  }

  function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formToPrecos = (f: PlanoForm): PrecosPlanos => {
      if (f.gratuito) {
        return {
          mensal: { enabled: true, valor: 0, desconto: 0 },
          semestral: { enabled: false, valor: 0, desconto: 0 },
          anual: { enabled: false, valor: 0, desconto: 0 },
        };
      }
      const mensal = parseValorRaw(f.precos.mensal.valorRaw);
      const semRaw = parseValorRaw(f.precos.semestral.valorRaw);
      const anualRaw = parseValorRaw(f.precos.anual.valorRaw);
      const descSem = clampDesconto(parseFloat(f.precos.semestral.descontoRaw) || 0);
      const descAnual = clampDesconto(parseFloat(f.precos.anual.descontoRaw) || 0);

      return {
        mensal: { enabled: true, valor: mensal, desconto: 0 },
        semestral: { enabled: f.precos.semestral.enabled, valor: semRaw, desconto: descSem },
        anual: { enabled: f.precos.anual.enabled, valor: anualRaw, desconto: descAnual },
      };
    };

    const data = {
      nome: form.nome.trim(),
      gratuito: form.gratuito,
      precos: formToPrecos(form),
      permissoes: form.permissoes,
    };

    if (editId) {
      preview.updatePlano(editId, data);
    } else {
      preview.addPlano(data);
    }
    setModalOpen(false);
    setEditId(null);
  }

  function confirmarExclusao() {
    if (deleteConfirm) {
      preview.removePlano(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  }

  function resumoPermissoes(p: PlanoPermissoes): string[] {
    const lines: string[] = [];
    lines.push(p.perfil ? "Criação de perfil incluída" : "Sem criação de perfil");
    if (p.ofertas.enabled) {
      const fmt = [];
      if (p.ofertas.formatos.texto) fmt.push("texto");
      if (p.ofertas.formatos.foto) fmt.push("foto");
      if (p.ofertas.formatos.video) fmt.push("vídeo");
      const fmtStr = fmt.length > 0 ? fmt.join(", ") : "nenhum";
      const duracaoStr = `${p.ofertas.duracao.quantidade} ${p.ofertas.duracao.unidade === "horas" ? "horas" : "dias"}`;
      lines.push(`${p.ofertas.quantidade} oferta${p.ofertas.quantidade !== 1 ? "s" : ""} por ${p.ofertas.periodoLimite === "dia" ? "dia" : "mês"} · duração de ${duracaoStr}`);
      lines.push(`Formatos: ${fmtStr}`);
    } else {
      lines.push("Publicação de ofertas não incluída");
    }
    if (p.produtos.enabled) {
      lines.push(`Até ${p.produtos.quantidadeMaxima} produto${p.produtos.quantidadeMaxima !== 1 ? "s" : ""}`);
    } else {
      lines.push("Cadastro de produtos não incluído");
    }
    if (p.destaques.enabled) {
      const durStr = `${p.destaques.duracao.quantidade} ${p.destaques.duracao.unidade === "horas" ? "horas" : "dias"}`;
      lines.push(`${p.destaques.quantidade} destaque${p.destaques.quantidade !== 1 ? "s" : ""} · duração de ${durStr}`);
    } else {
      lines.push("Destaques não incluídos");
    }
    return lines;
  }

  return (
    <section className="pln-page">
      <div className="pln-toolbar">
        <label className="pln-search">
          <input
            type="search"
            placeholder="Buscar plano..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </label>
        <button className="pln-btn pln-btn--primary" onClick={abrirNovo}>
          <Plus size={14} /> Novo plano
        </button>
      </div>

      {planosFiltrados.length === 0 ? (
        <div className="pln-empty">
          <strong>Nenhum plano encontrado</strong>
          <span>Clique em "Novo plano" para criar.</span>
        </div>
      ) : (
        <div className="pln-cards">
          {planosFiltrados.map((plano) => (
            <article key={plano.id} className="pln-card">
              <div className="pln-card-top">
                <h3>{plano.nome}</h3>
              </div>
              <div className="pln-card-price">
                {plano.gratuito ? (
                  <span className="pln-card-free">Grátis</span>
                ) : (
                  <PlanoPrecos precos={plano.precos} />
                )}
              </div>
              <ul className="pln-card-benefits">
                {resumoPermissoes(plano.permissoes).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              <div className="pln-card-actions">
                <button className="pln-icon-btn" onClick={() => setViewing(plano)} aria-label={`Ver ${plano.nome}`} title="Ver">
                  <Eye size={14} />
                </button>
                <button className="pln-icon-btn" onClick={() => abrirEdicao(plano.id)} aria-label={`Editar ${plano.nome}`} title="Editar">
                  <Pencil size={14} />
                </button>
                <button className="pln-icon-btn pln-icon-btn--danger" onClick={() => setDeleteConfirm(plano)} aria-label={`Excluir ${plano.nome}`} title="Excluir">
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="pln-modal-overlay" onClick={() => { setModalOpen(false); setEditId(null); }}>
          <div
            className="pln-modal"
            role="dialog"
            aria-label={editId ? "Editar plano" : "Novo plano"}
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pln-modal-header">
              <h3>{editId ? "Editar plano" : "Novo plano"}</h3>
              <button className="pln-modal-close" onClick={() => { setModalOpen(false); setEditId(null); }} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <form className="pln-modal-form" onSubmit={salvar}>
              {/* Nome */}
              <label className="pln-field">
                <span>Nome do plano</span>
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  placeholder="Ex: Plano Profissional"
                />
              </label>

              {/* Plano gratuito */}
              <label className="pln-switch-row">
                <span>Plano gratuito</span>
                <button
                  type="button"
                  className={`pln-switch ${form.gratuito ? "is-on" : ""}`}
                  role="switch"
                  aria-checked={form.gratuito}
                  onClick={() => handleGratuitoToggle(!form.gratuito)}
                >
                  <span className="pln-switch-track"><span className="pln-switch-thumb" /></span>
                </button>
              </label>

              {/* Preços por periodicidade */}
              <fieldset className="pln-fieldset">
                <legend>Preços por periodicidade</legend>
                <div className="pln-precos-rows">
                  {PERIODOS.map((periodo) => (
                    <div key={periodo} className="pln-preco-row">
                      <div className="pln-preco-row-head">
                        <span className="pln-preco-label">{PERIODICIDADE_LABELS[periodo]}</span>
                        {periodo !== "mensal" && (
                          <button
                            type="button"
                            className={`pln-switch pln-switch--sm ${form.precos[periodo].enabled ? "is-on" : ""}`}
                            role="switch"
                            aria-checked={form.precos[periodo].enabled}
                            disabled={form.gratuito}
                            onClick={() => handlePeriodoEnabled(periodo, !form.precos[periodo].enabled)}
                          >
                            <span className="pln-switch-track"><span className="pln-switch-thumb" /></span>
                          </button>
                        )}
                      </div>
                      <div className="pln-preco-row-inputs">
                        <label className="pln-field pln-field--valor">
                          <span>Valor total</span>
                          <div className="pln-input-currency">
                            <span className="pln-currency-symbol">R$</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="0,00"
                              value={form.precos[periodo].valorRaw}
                              disabled={form.gratuito || (!form.precos[periodo].enabled && periodo !== "mensal")}
                              onChange={(e) => handleValorChange(periodo, e.target.value)}
                              onBlur={() => handleValorBlur(periodo)}
                            />
                          </div>
                        </label>
                        {periodo !== "mensal" && (
                          <label className="pln-field pln-field--desconto">
                            <span>Desconto</span>
                            <div className="pln-input-percent">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                placeholder="0"
                                value={form.precos[periodo].descontoRaw}
                                disabled={form.gratuito || !form.precos[periodo].enabled}
                                onChange={(e) => handleDescontoChange(periodo, e.target.value)}
                                onBlur={() => handleDescontoBlur(periodo)}
                              />
                              <span className="pln-percent-symbol">%</span>
                            </div>
                          </label>
                        )}
                      </div>
                      {periodo !== "mensal" && form.precos[periodo].enabled && !form.gratuito && (
                        <EquivalentMensal
                          valor={parseValorRaw(form.precos[periodo].valorRaw)}
                          periodo={periodo}
                          mensal={parseValorRaw(form.precos.mensal.valorRaw)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* Permissões */}
              <fieldset className="pln-fieldset">
                <legend>Permissões</legend>

                {/* Perfil */}
                <div className="pln-perm-section">
                  <label className="pln-switch-row">
                    <span>Criar perfil</span>
                    <button
                      type="button"
                      className={`pln-switch ${form.permissoes.perfil ? "is-on" : ""}`}
                      role="switch"
                      aria-checked={form.permissoes.perfil}
                      onClick={() => handlePermissoesChange("perfil", !form.permissoes.perfil)}
                    >
                      <span className="pln-switch-track"><span className="pln-switch-thumb" /></span>
                    </button>
                  </label>
                </div>

                {/* Ofertas */}
                <div className="pln-perm-section">
                  <label className="pln-switch-row">
                    <span>Publicar ofertas</span>
                    <button
                      type="button"
                      className={`pln-switch ${form.permissoes.ofertas.enabled ? "is-on" : ""}`}
                      role="switch"
                      aria-checked={form.permissoes.ofertas.enabled}
                      onClick={() => handlePermissoesChange("ofertas.enabled", !form.permissoes.ofertas.enabled)}
                    >
                      <span className="pln-switch-track"><span className="pln-switch-thumb" /></span>
                    </button>
                  </label>
                  {form.permissoes.ofertas.enabled && (
                    <div className="pln-perm-fields">
                      <div className="pln-form-row">
                        <label className="pln-field">
                          <span>Quantidade de publicações</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={form.permissoes.ofertas.quantidade}
                            onChange={(e) => handlePermissoesChange("ofertas.quantidade", clampInt(parseFloat(e.target.value) || 0))}
                          />
                        </label>
                        <label className="pln-field">
                          <span>Período do limite</span>
                          <select
                            value={form.permissoes.ofertas.periodoLimite}
                            onChange={(e) => handlePermissoesChange("ofertas.periodoLimite", e.target.value)}
                          >
                            <option value="dia">Por dia</option>
                            <option value="mes">Por mês</option>
                          </select>
                        </label>
                      </div>
                      <div className="pln-form-row">
                        <label className="pln-field">
                          <span>Duração da oferta</span>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={form.permissoes.ofertas.duracao.quantidade}
                            onChange={(e) => handlePermissoesChange("ofertas.duracao.quantidade", clampInt(parseFloat(e.target.value) || 1, 1))}
                          />
                        </label>
                        <label className="pln-field">
                          <span>Unidade</span>
                          <select
                            value={form.permissoes.ofertas.duracao.unidade}
                            onChange={(e) => handlePermissoesChange("ofertas.duracao.unidade", e.target.value)}
                          >
                            <option value="horas">Horas</option>
                            <option value="dias">Dias</option>
                          </select>
                        </label>
                      </div>
                      <div className="pln-formatos">
                        <span className="pln-formatos-label">Formatos permitidos</span>
                        <div className="pln-formatos-options">
                          {(["texto", "foto", "video"] as const).map((fmt) => (
                            <label key={fmt} className="pln-checkbox-label">
                              <input
                                type="checkbox"
                                checked={form.permissoes.ofertas.formatos[fmt]}
                                onChange={(e) => handlePermissoesChange(`ofertas.formatos.${fmt}`, e.target.checked)}
                              />
                              <span>{fmt.charAt(0).toUpperCase() + fmt.slice(1)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Produtos */}
                <div className="pln-perm-section">
                  <label className="pln-switch-row">
                    <span>Cadastrar produtos</span>
                    <button
                      type="button"
                      className={`pln-switch ${form.permissoes.produtos.enabled ? "is-on" : ""}`}
                      role="switch"
                      aria-checked={form.permissoes.produtos.enabled}
                      onClick={() => handlePermissoesChange("produtos.enabled", !form.permissoes.produtos.enabled)}
                    >
                      <span className="pln-switch-track"><span className="pln-switch-thumb" /></span>
                    </button>
                  </label>
                  {form.permissoes.produtos.enabled && (
                    <label className="pln-field">
                      <span>Quantidade máxima de produtos</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form.permissoes.produtos.quantidadeMaxima}
                        onChange={(e) => handlePermissoesChange("produtos.quantidadeMaxima", clampInt(parseFloat(e.target.value) || 0))}
                      />
                    </label>
                  )}
                </div>

                {/* Destaques */}
                <div className="pln-perm-section">
                  <label className="pln-switch-row">
                    <span>Permitir destaques</span>
                    <button
                      type="button"
                      className={`pln-switch ${form.permissoes.destaques.enabled ? "is-on" : ""}`}
                      role="switch"
                      aria-checked={form.permissoes.destaques.enabled}
                      onClick={() => handlePermissoesChange("destaques.enabled", !form.permissoes.destaques.enabled)}
                    >
                      <span className="pln-switch-track"><span className="pln-switch-thumb" /></span>
                    </button>
                  </label>
                  {form.permissoes.destaques.enabled && (
                    <div className="pln-perm-fields">
                      <div className="pln-form-row">
                        <label className="pln-field">
                          <span>Quantidade de destaques</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={form.permissoes.destaques.quantidade}
                            onChange={(e) => handlePermissoesChange("destaques.quantidade", clampInt(parseFloat(e.target.value) || 0))}
                          />
                        </label>
                        <label className="pln-field">
                          <span>Duração do destaque</span>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={form.permissoes.destaques.duracao.quantidade}
                            onChange={(e) => handlePermissoesChange("destaques.duracao.quantidade", clampInt(parseFloat(e.target.value) || 1, 1))}
                          />
                        </label>
                        <label className="pln-field">
                          <span>Unidade</span>
                          <select
                            value={form.permissoes.destaques.duracao.unidade}
                            onChange={(e) => handlePermissoesChange("destaques.duracao.unidade", e.target.value)}
                          >
                            <option value="horas">Horas</option>
                            <option value="dias">Dias</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>

              <div className="pln-modal-actions">
                <button type="button" className="pln-btn pln-btn--ghost" onClick={() => { setModalOpen(false); setEditId(null); }}>
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
            aria-label={`Visualizar ${viewing.nome}`}
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pln-modal-header">
              <h3>{viewing.nome}</h3>
              <button className="pln-modal-close" onClick={() => setViewing(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
            <div className="pln-view-body">
              <h4 className="pln-view-section-title">Preços</h4>
              {viewing.gratuito ? (
                <p className="pln-view-free">Plano gratuito — sem cobrança</p>
              ) : (
                <div className="pln-view-precos">
                  {PERIODOS.map((periodo) => {
                    const preco = viewing.precos[periodo];
                    if (!preco.enabled && periodo !== "mensal") return null;
                    return (
                      <div key={periodo} className="pln-view-preco-row">
                        <span className="pln-view-preco-period">{PERIODICIDADE_LABELS[periodo]}</span>
                        <span className="pln-view-preco-valor">{formatBrl(preco.valor)}</span>
                        {periodo !== "mensal" && preco.desconto > 0 && (
                          <span className="pln-badge pln-badge--discount">-{preco.desconto}%</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <h4 className="pln-view-section-title">Permissões</h4>
              <ul className="pln-view-permissoes">
                {resumoPermissoes(viewing.permissoes).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="pln-modal-actions">
              <button className="pln-btn pln-btn--ghost" onClick={() => setViewing(null)}>
                Fechar
              </button>
              <button className="pln-btn pln-btn--primary" onClick={() => { setViewing(null); abrirEdicao(viewing.id); }}>
                Editar
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
            aria-label="Excluir plano"
            tabIndex={-1}
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pln-modal-header">
              <h3>Excluir plano?</h3>
              <button className="pln-modal-close" onClick={() => setDeleteConfirm(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
            <div className="pln-confirm-body">
              <p>Deseja excluir o plano <strong>{deleteConfirm.nome}</strong>?</p>
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
    </section>
  );
}

function PlanoPrecos({ precos }: { precos: PrecosPlanos }) {
  const enabled = PERIODOS.filter((p) => precos[p].enabled);
  return (
    <div className="pln-card-precos">
      {enabled.map((periodo) => (
        <div key={periodo} className="pln-card-preco-item">
          <span className="pln-card-preco-period">{PERIODICIDADE_LABELS[periodo]}</span>
          <span className="pln-card-preco-valor">{formatBrl(precos[periodo].valor)}</span>
          {periodo !== "mensal" && precos[periodo].desconto > 0 && (
            <span className="pln-card-preco-desc">-{precos[periodo].desconto}%</span>
          )}
        </div>
      ))}
    </div>
  );
}

function EquivalentMensal({ valor, periodo, mensal }: { valor: number; periodo: Periodicidade; mensal: number }) {
  const meses = periodo === "semestral" ? 6 : 12;
  const equiv = valor / meses;
  const economia = mensal * meses - valor;

  return (
    <div className="pln-equiv-mensal">
      <span>Equivale a {formatBrl(equiv)}/mês</span>
      {economia > 0 && (
        <span className="pln-equiv-economia">Economia de {formatBrl(economia)}</span>
      )}
    </div>
  );
}
