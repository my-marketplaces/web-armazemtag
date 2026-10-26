import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Store {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  region: string | null;
  status: string;
  createdAt: string;
}

const sampleStores: Store[] = [];

export function AdminStores() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cadastros</h1>
          <p className="text-slate-600 mt-1">Gerencie as lojas cadastradas na plataforma.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-600 mt-0.5 flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M12 9v4M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-amber-800">Autenticação pendente</p>
          <p className="text-xs text-amber-700 mt-1">
            A integração com Google OAuth está em desenvolvimento. Os dados abaixo são placeholders
            e não representam informações reais.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" disabled>
          Buscar
        </Button>
      </div>

      {sampleStores.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-500">Nenhuma loja para exibir em modo de prévia.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Região</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>{store.category || "—"}</TableCell>
                  <TableCell>{store.region || "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={store.status} />
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {new Date(store.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : status === "PENDING"
        ? "bg-yellow-100 text-yellow-700"
        : status === "SUSPENDED"
          ? "bg-red-100 text-red-700"
          : "bg-slate-100 text-slate-600";

  const labels: Record<string, string> = {
    ACTIVE: "Ativa",
    INACTIVE: "Inativa",
    SUSPENDED: "Suspensa",
    PENDING: "Pendente",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}>
      {labels[status] || status}
    </span>
  );
}
