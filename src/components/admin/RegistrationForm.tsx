import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useRegistrationsApi,
  type Registration,
  type RegistrationStatus,
  type CreateRegistrationInput,
} from "@/lib/registrations-api";
import { detectDocumentKind, normalizeDocument, isValidDocument } from "@/lib/document";

const schema = z
  .object({
    kind: z.enum(["INDIVIDUAL", "BUSINESS"]),
    fullName: z.string().min(1, "Nome é obrigatório"),
    legalName: z.string().optional(),
    document: z.string().min(1, "Documento é obrigatório"),
    phone: z.string().optional(),
    email: z.string().email("E-mail inválido").or(z.literal("")).optional(),
    address: z.string().optional(),
    addressNumber: z.string().optional(),
    addressComplement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().max(2, "Use a sigla com 2 letras").optional(),
    zipCode: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
    notes: z.string().optional(),
    accessUserIds: z.array(z.string()).optional(),
    responsibleId: z.string().optional(),
  })
  .refine((v) => !v.document || isValidDocument(v.document), {
    message: "Documento (CPF/CNPJ) inválido",
    path: ["document"],
  });

type FormValues = z.infer<typeof schema>;

function toFormValues(r: Registration): FormValues {
  return {
    kind: r.kind,
    fullName: r.fullName,
    legalName: r.legalName ?? undefined,
    document: normalizeDocument(r.document ?? ""),
    phone: r.phone ?? undefined,
    email: r.email ?? undefined,
    address: r.address ?? undefined,
    addressNumber: r.addressNumber ?? undefined,
    addressComplement: r.addressComplement ?? undefined,
    neighborhood: r.neighborhood ?? undefined,
    city: r.city ?? undefined,
    state: r.state ?? undefined,
    zipCode: r.zipCode ?? undefined,
    status: r.status,
    notes: r.notes ?? undefined,
    accessUserIds: r.accesses.map((a) => a.userId),
    responsibleId: r.responsibleId ?? undefined,
  };
}

const EMPTY: FormValues = {
  kind: "INDIVIDUAL",
  fullName: "",
  document: "",
  status: "ACTIVE",
};

export function RegistrationForm({
  initial,
  onSubmitSuccess,
}: {
  initial: Registration | null;
  onSubmitSuccess: () => void;
}) {
  const api = useRegistrationsApi();
  const query = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ? toFormValues(initial) : EMPTY,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateRegistrationInput) => api.create(input),
    onSuccess: () => {
      toast.success("Cadastro criado.");
      onSubmitSuccess();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateRegistrationInput }) =>
      api.update(id, input),
    onSuccess: () => {
      toast.success("Cadastro atualizado.");
      onSubmitSuccess();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const busy = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: FormValues) => {
    const payload: CreateRegistrationInput = {
      kind: values.kind,
      fullName: values.fullName,
      legalName: values.legalName || undefined,
      document: values.document,
      phone: values.phone || undefined,
      email: values.email || undefined,
      address: values.address || undefined,
      addressNumber: values.addressNumber || undefined,
      addressComplement: values.addressComplement || undefined,
      neighborhood: values.neighborhood || undefined,
      city: values.city || undefined,
      state: values.state?.toUpperCase() || undefined,
      zipCode: values.zipCode || undefined,
      status: values.status,
      notes: values.notes || undefined,
      accessUserIds: values.accessUserIds?.filter(Boolean),
      responsibleId: values.responsibleId || undefined,
    };
    if (initial) {
      updateMutation.mutate({ id: initial.id, input: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const kind = query.watch("kind");
  const document = query.watch("document");

  return (
    <form className="at-form" onSubmit={query.handleSubmit(onSubmit)}>
      <fieldset className="at-form__field">
        <label htmlFor="rf-kind">Tipo de cadastro</label>
        <select
          id="rf-kind"
          {...query.register("kind", {
            onChange: (e) => {
              if (!document) return;
              const detected = detectDocumentKind(document);
              if (detected !== e.target.value) return;
            },
          })}
        >
          <option value="INDIVIDUAL">Pessoa Física</option>
          <option value="BUSINESS">Pessoa Jurídica</option>
        </select>
      </fieldset>

      <div className="at-form__row">
        <fieldset className="at-form__field">
          <label htmlFor="rf-fullName">Nome completo*</label>
          <input id="rf-fullName" {...query.register("fullName")} placeholder="Nome do cadastro" />
          {query.formState.errors.fullName && (
            <span className="at-form__error">{query.formState.errors.fullName.message}</span>
          )}
        </fieldset>

        {kind === "BUSINESS" && (
          <fieldset className="at-form__field">
            <label htmlFor="rf-legalName">Nome fantasia</label>
            <input id="rf-legalName" {...query.register("legalName")} placeholder="Nome fantasia" />
          </fieldset>
        )}
      </div>

      <div className="at-form__row">
        <fieldset className="at-form__field">
          <label htmlFor="rf-document">Documento (CPF/CNPJ)*</label>
          <input
            id="rf-document"
            {...query.register("document")}
            placeholder="000.000.000-00"
            maxLength={18}
          />
          {query.formState.errors.document && (
            <span className="at-form__error">{query.formState.errors.document.message}</span>
          )}
        </fieldset>

        <fieldset className="at-form__field">
          <label htmlFor="rf-phone">Telefone</label>
          <input id="rf-phone" {...query.register("phone")} placeholder="(00) 00000-0000" />
        </fieldset>
      </div>

      <fieldset className="at-form__field">
        <label htmlFor="rf-email">E-mail</label>
        <input
          id="rf-email"
          type="email"
          {...query.register("email")}
          placeholder="email@exemplo.com"
        />
        {query.formState.errors.email && (
          <span className="at-form__error">{query.formState.errors.email.message}</span>
        )}
      </fieldset>

      <fieldset className="at-form__field">
        <label htmlFor="rf-address">Endereço</label>
        <input id="rf-address" {...query.register("address")} placeholder="Rua, avenida..." />
      </fieldset>

      <div className="at-form__row at-form__row--3">
        <fieldset className="at-form__field">
          <label htmlFor="rf-addressNumber">Número</label>
          <input id="rf-addressNumber" {...query.register("addressNumber")} />
        </fieldset>
        <fieldset className="at-form__field">
          <label htmlFor="rf-addressComplement">Complemento</label>
          <input id="rf-addressComplement" {...query.register("addressComplement")} />
        </fieldset>
        <fieldset className="at-form__field">
          <label htmlFor="rf-neighborhood">Bairro</label>
          <input id="rf-neighborhood" {...query.register("neighborhood")} />
        </fieldset>
      </div>

      <div className="at-form__row">
        <fieldset className="at-form__field">
          <label htmlFor="rf-city">Cidade</label>
          <input id="rf-city" {...query.register("city")} />
        </fieldset>
        <fieldset className="at-form__field at-form__field--sm">
          <label htmlFor="rf-state">UF</label>
          <input id="rf-state" {...query.register("state")} maxLength={2} placeholder="SP" />
        </fieldset>
        <fieldset className="at-form__field">
          <label htmlFor="rf-zipCode">CEP</label>
          <input
            id="rf-zipCode"
            {...query.register("zipCode")}
            placeholder="00000-000"
            maxLength={9}
          />
        </fieldset>
      </div>

      <fieldset className="at-form__field">
        <label htmlFor="rf-status">Status</label>
        <select id="rf-status" {...query.register("status")}>
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
          <option value="SUSPENDED">Suspenso</option>
        </select>
      </fieldset>

      <fieldset className="at-form__field">
        <label htmlFor="rf-notes">Observações</label>
        <textarea id="rf-notes" {...query.register("notes")} rows={3} />
      </fieldset>

      <div className="at-form__actions">
        <button type="submit" className="at-btn at-btn--primary" disabled={busy}>
          {busy && <Loader2 size={14} className="at-spin" aria-hidden="true" />}
          {initial ? "Salvar alterações" : "Criar cadastro"}
        </button>
      </div>
    </form>
  );
}
