import type { OperationalOccurrence } from "@/types/operations";

// TODO(T029): replace this fixture with the triage queue API after it is merged.
export const operationalOccurrencesFixture: OperationalOccurrence[] = [
  {
    id: "00000000-0000-4000-8000-000000000248",
    displayCode: "#MF-0248",
    address: "Rua das Mangueiras, 128",
    neighborhood: "Centro",
    locationContext: "Centro · terreno ao lado da praça",
    latitude: null,
    longitude: null,
    createdAt: "2026-10-26T17:42:00.000Z",
    waitingMinutes: 18,
    nextAction: "despachar",
    priority: "high",
    status: {
      key: "validated",
      name: "Validada",
    },
    mapPosition: {
      x: 69,
      y: 39,
    },
    evidence: [
      {
        id: "evidence-mf-0248-1",
        alt: "Primeira evidência da ocorrência MF-0248",
      },
      {
        id: "evidence-mf-0248-2",
        alt: "Segunda evidência da ocorrência MF-0248",
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000251",
    displayCode: "#MF-0251",
    address: "Rua Primavera, 52",
    neighborhood: "Primavera",
    locationContext: "Primavera · próximo ao canal",
    latitude: null,
    longitude: null,
    createdAt: "2026-10-26T17:34:00.000Z",
    waitingMinutes: 26,
    nextAction: "revisar",
    priority: "medium",
    status: {
      key: "new",
      name: "Nova",
    },
    mapPosition: {
      x: 27,
      y: 58,
    },
    evidence: [
      {
        id: "evidence-mf-0251-1",
        alt: "Evidência da ocorrência MF-0251",
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000239",
    displayCode: "#MF-0239",
    address: "Rua Brasília, 87",
    neighborhood: "Brasília",
    locationContext: "Brasília · área residencial",
    latitude: null,
    longitude: null,
    createdAt: "2026-10-26T16:48:00.000Z",
    waitingMinutes: 72,
    nextAction: "retorno",
    priority: "low",
    status: {
      key: "pending",
      name: "Pendente",
    },
    mapPosition: {
      x: 78,
      y: 68,
    },
    evidence: [
      {
        id: "evidence-mf-0239-1",
        alt: "Evidência da ocorrência MF-0239",
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000253",
    displayCode: "#MF-0253",
    address: "Avenida Canafístula, 210",
    neighborhood: "Canafístula",
    locationContext: "Canafístula · proximidade de terreno aberto",
    latitude: null,
    longitude: null,
    createdAt: "2026-10-26T17:51:00.000Z",
    waitingMinutes: 9,
    nextAction: "comparar",
    priority: "medium",
    status: {
      key: "under_review",
      name: "Em análise",
    },
    mapPosition: {
      x: 42,
      y: 72,
    },
    evidence: [
      {
        id: "evidence-mf-0253-1",
        alt: "Evidência da ocorrência MF-0253",
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000261",
    displayCode: "#MF-0261",
    address: "Rua do Centro, 302",
    neighborhood: "Centro",
    locationContext: "Centro · área comercial",
    latitude: null,
    longitude: null,
    createdAt: "2026-10-26T15:56:00.000Z",
    waitingMinutes: 124,
    nextAction: "despachar",
    priority: "high",
    status: {
      key: "validated",
      name: "Validada",
    },
    mapPosition: {
      x: 38,
      y: 30,
    },
    evidence: [
      {
        id: "evidence-mf-0261-1",
        alt: "Evidência da ocorrência MF-0261",
      },
    ],
  },
];