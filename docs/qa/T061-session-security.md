# T061 — Correção de redirecionamentos e proteção de detalhes

## Causas
- `FieldDay` e `DayPriorities` faziam `window.location.replace('/entrar')` quando o JWT era inválido, sem limpar cookies; o proxy redirecionava `'/entrar'` de volta para a área do agente por causa do cookie desatualizado.
- O proxy considerava o JWT presente como válido sem avaliar o `exp` e o perfil declarados no payload.
- A rota de detalhes do agente (T056) não usava a validação de sessão nem `enabled` no `useQuery`.
- A branch T061 não continha as alterações posteriores da `main`, incluindo T056; foi atualizada com merge explícito de `origin/main`.

## Correções
- Proxy verifica expiração e coerência do perfil de sessão, limpa cookies inválidos e redireciona sem loop.
- Os componentes `FieldDay` e `DayPriorities` limpam a sessão antes do redirecionamento, evitando reentrada com `AUTH_EVENT`.
- `AgentOccurrenceDetails` só renderiza e consulta os dados quando há sessão ativa; verifica `pageshow`, `popstate`, `focus`, `visibilitychange` e `AUTH_EVENT`.

## Validação
- TypeScript, lint e build concluídos no worktree.
- Requisições HTTP com JWT expirado: `/entrar` retorna 200 com cookies removidos; rotas de agente redirecionam para login com limpeza de cookies.
- Navegador com cookie de agente válido mas sem sessionStorage (nova aba): redireciona uma vez para login, limpa cookies e mantém login acessível; teste automatizado passou.
- **Nota de segurança:** o proxy decodifica o token apenas para verificar expiração e coerência do papel; assinatura e autorização real devem ser verificadas pela API. A lógica do cliente não substitui autorização do Back-end.
