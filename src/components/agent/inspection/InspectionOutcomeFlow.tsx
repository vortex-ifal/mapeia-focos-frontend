"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CircleCheck, Info, TriangleAlert, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

import {
  INSPECTION_OUTCOMES,
  getInspectionOutcomeLabel,
  inspectionDraftKey,
  isInspectionOutcome,
  type InspectionDraft,
} from "@/controllers/agent/inspection-outcome.controller";
import { getAuthSession, getAuthToken, mapRoleToUserRole } from "@/controllers/auth.controller";
import { decodeJwtPayload, type JwtAuthPayload } from "@/utils/jwt.utils";
import { useRouter } from "next/navigation";
import { getLocationDetails } from "@/controllers/agent/agent-occurrence-details.controller";
import { getOccurrenceDetails } from "@/services/api/occurrence-details.service";
import { submitInspectionOutcome } from "@/services/api/inspection-outcome.service";

function hasActiveAgentSession(): boolean {
  const user = getAuthSession();
  const token = getAuthToken();
  if (!user || !token || user.role !== "agent" || user.token !== token) return false;
  const payload = decodeJwtPayload<JwtAuthPayload>(token);
  return Boolean(payload && mapRoleToUserRole(payload.role) === "agent" &&
    typeof payload.exp === "number" && payload.exp * 1000 > Date.now());
}

function readInspectionDraft(occurrenceId: string): InspectionDraft {
  const blank: InspectionDraft = { outcome: null, notes: "" };
  if (typeof window === "undefined") return blank;
  try {
    const saved = sessionStorage.getItem(inspectionDraftKey(occurrenceId));
    if (!saved) return blank;
    const value: unknown = JSON.parse(saved);
    if (!value || typeof value !== "object" || !("outcome" in value)) return blank;
    const record = value as Partial<InspectionDraft>;
    return {
      outcome: isInspectionOutcome(record.outcome) ? record.outcome : null,
      notes: typeof record.notes === "string" ? record.notes : "",
      condition: typeof record.condition === "string" ? record.condition : undefined,
      actions: Array.isArray(record.actions)
        ? record.actions.filter((item): item is string => typeof item === "string")
        : undefined,
      media: Array.isArray(record.media)
        ? record.media.filter((item): item is { id: string; url: string } =>
            item !== null && typeof item === "object" &&
            typeof item.id === "string" && typeof item.url === "string")
        : undefined,
    };
  } catch {
    return blank;
  }
}
const primary = "flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#C94F32] px-4 text-[14px] font-bold text-white transition hover:bg-[#B9472E] disabled:cursor-not-allowed disabled:opacity-50";
const secondary = "flex h-[48px] w-full items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white px-4 text-[14px] font-bold text-[#171717] hover:bg-[#F4EFE6]";

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="flex h-[52px] items-center gap-[10px]">
      <button type="button" onClick={onBack} aria-label="Voltar" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white"><ArrowLeft size={20} /></button>
      <h1 className="text-[18px] font-bold text-[#171717]">{title}</h1>
    </header>
  );
}

export function InspectionOutcomeFlow({ occurrenceId }: { occurrenceId: string }) {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<InspectionDraft>(() => readInspectionDraft(occurrenceId));
  const [authorized, setAuthorized] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const detailPath = `/dia-em-campo/ocorrencias/${encodeURIComponent(occurrenceId)}`;

  useEffect(() => {
    function verify() {
      if (!hasActiveAgentSession()) {
        setAuthorized(false);
        window.location.replace("/entrar");
        return;
      }
      setAuthorized(true);
    }
    function visible() { if (document.visibilityState === "visible") verify(); }
    verify();
    window.addEventListener("pageshow", verify);
    window.addEventListener("popstate", verify);
    window.addEventListener("focus", verify);
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.removeEventListener("pageshow", verify);
      window.removeEventListener("popstate", verify);
      window.removeEventListener("focus", verify);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);

  useEffect(() => {
    if (success) return;
    try { sessionStorage.setItem(inspectionDraftKey(occurrenceId), JSON.stringify(draft)); } catch { /* Sem armazenamento disponível. */ }
  }, [draft, occurrenceId, success]);

  const occurrenceQuery = useQuery({
    queryKey: ["agent", "occurrence", occurrenceId],
    queryFn: () => getOccurrenceDetails(occurrenceId),
    enabled: authorized,
    staleTime: 30_000,
  });

  function back() {
    setError(null);
    if (stage === 3) setStage(2);
    else if (stage === 2) setStage(1);
    else router.push(detailPath);
  }

  async function conclude() {
    if (!draft.outcome || submitting || success) return;
    setError(null);
    setSubmitting(true);
    try {
      await submitInspectionOutcome(occurrenceId, draft);
      sessionStorage.removeItem(inspectionDraftKey(occurrenceId));
      await queryClient.invalidateQueries({ queryKey: ["agent"] });
      setSuccess(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha ao enviar a vistoria.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!authorized) return <main className="min-h-dvh bg-[#FBF8F2]" aria-busy="true" />;
  if (success) return (
    <main className="min-h-dvh bg-[#FBF8F2] px-[18px] py-8 text-[#171717]">
      <div className="mx-auto max-w-[354px] rounded-[16px] border border-[#E9E0D4] bg-white p-5">
        <CircleCheck className="text-[#137333]" size={28} />
        <h1 className="mt-3 text-[20px] font-bold">Vistoria concluída</h1>
        <p className="mt-2 text-[13px] text-[#716B67]">Os dados foram recebidos pela API.</p>
        <Link href="/dia-em-campo/prioridades" className={`${primary} mt-5`}>Voltar às prioridades</Link>
      </div>
    </main>
  );

  const selected = INSPECTION_OUTCOMES.find((item) => item.value === draft.outcome);
  const address = occurrenceQuery.data ? getLocationDetails(occurrenceQuery.data) : null;
  const photos = draft.media ?? [];

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-[14px] px-[18px] pb-[22px] pt-[18px] max-[360px]:px-4">
        <Header title={stage === 3 ? "Revisar vistoria" : "Desfecho da vistoria"} onBack={back} />

        {stage === 1 && <>
          <p className="text-[16px] text-[#716B67]">Como terminou a tentativa de vistoria? Escolha uma opção.</p>
          <h2 className="text-[14px] font-bold text-[#716B67]">Verificação realizada</h2>
          {INSPECTION_OUTCOMES.filter((item) => item.group === "completed").map((item) => <OutcomeOption key={item.value} item={item} checked={draft.outcome === item.value} onSelect={() => setDraft({ ...draft, outcome: item.value })} />)}
          <h2 className="text-[14px] font-bold text-[#716B67]">Visita não concluída ou requer nova ação</h2>
          {INSPECTION_OUTCOMES.filter((item) => item.group === "pending").map((item) => <OutcomeOption key={item.value} item={item} checked={draft.outcome === item.value} onSelect={() => setDraft({ ...draft, outcome: item.value })} />)}
          <button type="button" disabled={!draft.outcome} className={primary} onClick={() => setStage(2)}>Continuar</button>
        </>}

        {stage === 2 && <>
          {selected && <div className="flex h-[72px] items-center gap-2 rounded-[12px] border border-[#E9E0D4] bg-white p-3 text-[13px] font-semibold"><CircleCheck size={20} />{selected.label}</div>}
          <label htmlFor="inspection-note" className="rounded-[12px] border border-[#E9E0D4] bg-white p-3">
            <span className="mb-2 block text-[12px] font-semibold text-[#716B67]">Observação</span>
            <textarea id="inspection-note" rows={3} maxLength={1000} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="Descreva a situação encontrada durante a vistoria." className="w-full resize-y bg-transparent text-[14px] text-[#171717] outline-none placeholder:text-[#716B67]" />
          </label>
          <button type="button" className={primary} onClick={() => setStage(3)}>Continuar</button>
        </>}

        {stage === 3 && <>
          <div className="flex min-h-[88px] flex-col justify-center gap-[3px] rounded-[12px] border border-[#E9E0D4] bg-white px-3 py-[10px]">
            <p className="text-[15px] font-bold">{address?.street ?? (occurrenceQuery.isPending ? "Carregando localização..." : "Endereço não disponível")}</p>
            <p className="text-[12px] text-[#716B67]">{address?.context ?? "Localização da ocorrência"}</p>
          </div>
          <section className="flex min-h-[290px] flex-col gap-3 rounded-[16px] border border-[#E9E0D4] bg-white p-4 text-[13px]">
            <p><strong>Condição encontrada</strong> · {draft.condition ?? "Pendente (T058)"}</p>
            <p><strong>Ações realizadas</strong> · {draft.actions?.join(", ") || "Pendentes (T058)"}</p>
            <p><strong>Resultado</strong> · {draft.outcome ? getInspectionOutcomeLabel(draft.outcome) : "Não selecionado"}</p>
            <p><strong>Observação</strong> · {draft.notes.trim() || "Não preenchida"}</p>
          </section>
          {photos.length > 0 && <div className="flex flex-wrap gap-[10px]" aria-label="Fotos da vistoria">{photos.map((photo) => <div key={photo.id} className="relative flex h-[82px] w-[104px] items-center justify-center overflow-hidden rounded-[10px] border border-[#E9E0D4] bg-[#F4EFE6]"><ImageIcon size={20} /><span className="sr-only">Foto vinculada à vistoria</span></div>)}</div>}
          {error && <p role="alert" className="rounded-[12px] bg-[#F8E3E0] p-3 text-[13px] text-[#9D352D]">{error}</p>}
          <button type="button" disabled={!draft.outcome || submitting || !draft.condition || !draft.actions || !process.env.NEXT_PUBLIC_INSPECTION_SUBMIT_PATH} className={primary} onClick={() => void conclude()}>{submitting ? "Enviando..." : "Concluir vistoria"}</button>
          {(!draft.condition || !draft.actions || !process.env.NEXT_PUBLIC_INSPECTION_SUBMIT_PATH) && <p className="text-[12px] text-[#716B67]">Conclusão indisponível até integrar o registro da T058 e confirmar o contrato da API de vistorias.</p>}
          <button type="button" className={secondary} onClick={() => { setError(null); setStage(1); }}>Voltar e editar</button>
        </>}
      </div>
    </main>
  );
}

type OutcomeItem = (typeof INSPECTION_OUTCOMES)[number];
function OutcomeOption({ item, checked, onSelect }: { item: OutcomeItem; checked: boolean; onSelect: () => void }) {
  return <button type="button" role="radio" aria-checked={checked} onClick={onSelect} className={`flex h-[72px] w-full items-center gap-2 rounded-[12px] border bg-white p-3 text-left text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F32] ${checked ? "border-[#C94F32] bg-[#FFF5F0]" : "border-[#E9E0D4]"}`}>
    {item.icon === "check" ? <CircleCheck size={20} aria-hidden /> : item.icon === "info" ? <Info size={20} aria-hidden /> : <TriangleAlert size={20} aria-hidden />}
    {item.label}
    <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full border border-[#C94F32]" aria-hidden="true">{checked && <span className="h-2 w-2 rounded-full bg-[#C94F32]" />}</span>
  </button>;
}
