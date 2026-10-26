import { createContext, useContext, useState, type ReactNode } from "react";

export type CadastroRow = {
  id: string;
  nome: string;
  tipo: "PF" | "PJ";
  documento: string;
  email: string;
  telefone: string;
  situacao: string;
  atividade: "Comércio" | "Serviço" | "Comércio e serviço";
  categoriaId?: string;
  planoId: string;
  criadoEm: string;
};

export type Periodicidade = "mensal" | "semestral" | "anual";

export type PrecoPeriodo = {
  enabled: boolean;
  valor: number;
  desconto: number;
};

export type PrecosPlanos = {
  mensal: PrecoPeriodo;
  semestral: PrecoPeriodo;
  anual: PrecoPeriodo;
};

export type PermissaoOfertas = {
  enabled: boolean;
  quantidade: number;
  periodoLimite: "dia" | "mes";
  duracao: { quantidade: number; unidade: "horas" | "dias" };
  formatos: { texto: boolean; foto: boolean; video: boolean };
};

export type PermissaoProdutos = {
  enabled: boolean;
  quantidadeMaxima: number;
};

export type PermissaoDestaques = {
  enabled: boolean;
  quantidade: number;
  duracao: { quantidade: number; unidade: "horas" | "dias" };
};

export type PlanoPermissoes = {
  perfil: boolean;
  ofertas: PermissaoOfertas;
  produtos: PermissaoProdutos;
  destaques: PermissaoDestaques;
};

export type PlanoRow = {
  id: string;
  nome: string;
  gratuito: boolean;
  precos: PrecosPlanos;
  permissoes: PlanoPermissoes;
  criadoEm: string;
};

export type AssinaturaRow = {
  id: string;
  nome: string;
  cadastroId: string;
  cadastroNome: string;
  cadastroTipo: "PF" | "PJ";
  cadastroDocumento: string;
  cadastroTelefone: string;
  cadastroEmail: string;
  planoId: string;
  planoNome: string;
  valor: number;
  periodicidade: Periodicidade;
  situacao: "Pendente" | "Regular" | "Cancelado";
  bloqueada: boolean;
  planoSnapshot: {
    precos: PrecosPlanos;
    permissoes: PlanoPermissoes;
  };
};

export type AnuncioRow = {
  id: string;
  titulo: string;
  anuncianteId: string;
  anuncianteNome: string;
  categoria: string;
  categoriaId?: string;
  descricao: string;
  imagem: string;
  link: string;
  inicio: string;
  termino: string;
  situacao: "rascunho" | "publicado" | "pausado";
  criadoEm: string;
};

export type DestaqueEspaco = {
  id: string;
  nome: string;
  categoria: string;
  categoriaId?: string;
  anuncioIds: string[];
  intervaloSegundos: number;
  ativo: boolean;
};

export type CategoriaRow = {
  id: string;
  nome: string;
  tipoAtividade: "Comércio" | "Serviço" | "Comércio e serviço";
  descricao: string;
  icone: string;
  imagem?: string; // data URL (local preview) or RustFS URL (future)
  imagemId?: string; // RustFS object identifier (future)
  ordem: number;
  situacao: "Ativa" | "Inativa";
};

export type IndicadorRow = {
  id: string;
  cadastroId: string;
  nome: string;
  tipo: "PF" | "PJ";
  documento: string;
  telefone: string;
  email: string;
  pixTipo: "CPF" | "CNPJ" | "E-mail" | "Telefone" | "Aleatória";
  pixChave: string;
  pixTitularNome: string;
  pixTitularDocumento: string;
};

export type IndicacaoRow = {
  id: string;
  indicadorId: string;
  indicadoId: string;
  data: string;
  situacao: "Pendente" | "Efetivada" | "Cancelada";
  comissao: number;
  comissaoSituacao: "A receber" | "Paga";
};

export type PreviewData = {
  cadastros: CadastroRow[];
  planos: PlanoRow[];
  assinaturas: AssinaturaRow[];
  anuncios: AnuncioRow[];
  destaques: DestaqueEspaco[];
  categorias: CategoriaRow[];
  indicadores: IndicadorRow[];
  indicacoes: IndicacaoRow[];
};

export type PreviewContextValue = PreviewData & {
  addCadastro: (c: Omit<CadastroRow, "id" | "criadoEm">) => CadastroRow;
  updateCadastro: (id: string, data: Partial<CadastroRow>) => void;
  removeCadastro: (id: string) => void;
  addPlano: (p: Omit<PlanoRow, "id" | "criadoEm">) => PlanoRow;
  updatePlano: (id: string, data: Partial<PlanoRow>) => void;
  removePlano: (id: string) => void;
  addAssinatura: (a: Omit<AssinaturaRow, "id">) => AssinaturaRow;
  updateAssinatura: (id: string, data: Partial<AssinaturaRow>) => void;
  removeAssinatura: (id: string) => void;
  addAnuncio: (a: Omit<AnuncioRow, "id" | "criadoEm">) => AnuncioRow;
  updateAnuncio: (id: string, data: Partial<AnuncioRow>) => void;
  removeAnuncio: (id: string) => void;
  addDestaque: (d: Omit<DestaqueEspaco, "id">) => DestaqueEspaco;
  updateDestaque: (id: string, data: Partial<DestaqueEspaco>) => void;
  removeDestaque: (id: string) => void;
  addCategoria: (c: Omit<CategoriaRow, "id">) => CategoriaRow;
  updateCategoria: (id: string, data: Partial<CategoriaRow>) => void;
  removeCategoria: (id: string) => void;
  addIndicador: (i: Omit<IndicadorRow, "id">) => IndicadorRow;
  updateIndicador: (id: string, data: Partial<IndicadorRow>) => void;
  addIndicacao: (i: Omit<IndicacaoRow, "id">) => IndicacaoRow;
  updateIndicacao: (id: string, data: Partial<IndicacaoRow>) => void;
};

function genId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function hoje(): string {
  return new Date().toLocaleDateString("pt-BR");
}

const PreviewContext = createContext<PreviewContextValue | null>(null);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [cadastros, setCadastros] = useState<CadastroRow[]>([]);
  const [planos, setPlanos] = useState<PlanoRow[]>([]);
  const [assinaturas, setAssinaturas] = useState<AssinaturaRow[]>([]);
  const [anuncios, setAnuncios] = useState<AnuncioRow[]>([]);
  const [destaques, setDestaques] = useState<DestaqueEspaco[]>([]);
  const [categorias, setCategorias] = useState<CategoriaRow[]>([]);
  const [indicadores, setIndicadores] = useState<IndicadorRow[]>([]);
  const [indicacoes, setIndicacoes] = useState<IndicacaoRow[]>([]);

  const addCadastro: PreviewContextValue["addCadastro"] = (c) => {
    const novo: CadastroRow = { ...c, id: genId(), criadoEm: hoje() };
    setCadastros((prev) => [novo, ...prev]);
    return novo;
  };

  const updateCadastro: PreviewContextValue["updateCadastro"] = (id, data) => {
    setCadastros((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const removeCadastro: PreviewContextValue["removeCadastro"] = (id) => {
    setCadastros((prev) => prev.filter((r) => r.id !== id));
  };

  const addPlano: PreviewContextValue["addPlano"] = (p) => {
    const novo: PlanoRow = { ...p, id: genId(), criadoEm: hoje() };
    setPlanos((prev) => [novo, ...prev]);
    return novo;
  };

  const updatePlano: PreviewContextValue["updatePlano"] = (id, data) => {
    setPlanos((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const removePlano: PreviewContextValue["removePlano"] = (id) => {
    setPlanos((prev) => prev.filter((r) => r.id !== id));
  };

  const addAssinatura: PreviewContextValue["addAssinatura"] = (a) => {
    const nova: AssinaturaRow = { ...a, id: genId() };
    setAssinaturas((prev) => [nova, ...prev]);
    return nova;
  };

  const updateAssinatura: PreviewContextValue["updateAssinatura"] = (id, data) => {
    setAssinaturas((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const removeAssinatura: PreviewContextValue["removeAssinatura"] = (id) => {
    setAssinaturas((prev) => prev.filter((r) => r.id !== id));
  };

  const addAnuncio: PreviewContextValue["addAnuncio"] = (a) => {
    const novo: AnuncioRow = { ...a, id: genId(), criadoEm: hoje() };
    setAnuncios((prev) => [novo, ...prev]);
    return novo;
  };

  const updateAnuncio: PreviewContextValue["updateAnuncio"] = (id, data) => {
    setAnuncios((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const removeAnuncio: PreviewContextValue["removeAnuncio"] = (id) => {
    setAnuncios((prev) => prev.filter((r) => r.id !== id));
  };

  const addDestaque: PreviewContextValue["addDestaque"] = (d) => {
    const novo: DestaqueEspaco = { ...d, id: genId() };
    setDestaques((prev) => [novo, ...prev]);
    return novo;
  };

  const updateDestaque: PreviewContextValue["updateDestaque"] = (id, data) => {
    setDestaques((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const removeDestaque: PreviewContextValue["removeDestaque"] = (id) => {
    setDestaques((prev) => prev.filter((r) => r.id !== id));
  };

  const addCategoria: PreviewContextValue["addCategoria"] = (c) => {
    const nova: CategoriaRow = { ...c, id: genId() };
    setCategorias((prev) => [nova, ...prev]);
    return nova;
  };

  const updateCategoria: PreviewContextValue["updateCategoria"] = (id, data) => {
    setCategorias((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const removeCategoria: PreviewContextValue["removeCategoria"] = (id) => {
    setCategorias((prev) => prev.filter((r) => r.id !== id));
  };

  const addIndicador: PreviewContextValue["addIndicador"] = (i) => {
    const novo: IndicadorRow = { ...i, id: genId() };
    setIndicadores((prev) => [novo, ...prev]);
    return novo;
  };

  const updateIndicador: PreviewContextValue["updateIndicador"] = (id, data) => {
    setIndicadores((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const addIndicacao: PreviewContextValue["addIndicacao"] = (i) => {
    const nova: IndicacaoRow = { ...i, id: genId() };
    setIndicacoes((prev) => [nova, ...prev]);
    return nova;
  };

  const updateIndicacao: PreviewContextValue["updateIndicacao"] = (id, data) => {
    setIndicacoes((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  return (
    <PreviewContext.Provider
      value={{
        cadastros,
        planos,
        assinaturas,
        anuncios,
        destaques,
        categorias,
        addCadastro,
        updateCadastro,
        removeCadastro,
        addPlano,
        updatePlano,
        removePlano,
        addAssinatura,
        updateAssinatura,
        removeAssinatura,
        addAnuncio,
        updateAnuncio,
        removeAnuncio,
        addDestaque,
        updateDestaque,
        removeDestaque,
        addCategoria,
        updateCategoria,
        removeCategoria,
        indicadores,
        indicacoes,
        addIndicador,
        updateIndicador,
        addIndicacao,
        updateIndicacao,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview(): PreviewContextValue {
  const ctx = useContext(PreviewContext);
  if (!ctx) throw new Error("usePreview must be used within PreviewProvider");
  return ctx;
}
